import httpClient from '../http-client'
import type { LoginRequestDto, LoginResponseDto, MeResponseDto } from '@/types/auth.types'

export class AuthService {
  private static readonly BASE_URLS = ['/auth', '/v1/Auth', '/api/v1/Auth'] as const

  private static normalizeLoginResponse(
    payload: Record<string, unknown>,
    credentials: LoginRequestDto,
  ): LoginResponseDto {
    const token =
      (payload.accessToken as string | undefined) ||
      (payload.token as string | undefined) ||
      (payload.jwt as string | undefined)

    const userFromPayload =
      (payload.user as Record<string, unknown> | undefined) ||
      (payload.profile as Record<string, unknown> | undefined)

    const fallbackName = credentials.usernameOrEmail.split('@')[0] || credentials.usernameOrEmail

    return {
      accessToken: token,
      token,
      user: {
        id: (userFromPayload?.id as string | undefined) || (payload.id as string | undefined),
        name: (userFromPayload?.name as string | undefined) || fallbackName,
        email:
          (userFromPayload?.email as string | undefined) ||
          (payload.email as string | undefined) ||
          credentials.usernameOrEmail,
        role: (userFromPayload?.role as string | undefined) || (payload.role as string | undefined),
      },
    }
  }

  private static normalizeMeResponse(payload: Record<string, unknown>): MeResponseDto {
    const userFromPayload =
      (payload.user as Record<string, unknown> | undefined) ||
      (payload.profile as Record<string, unknown> | undefined)

    if (!userFromPayload) {
      if (payload.id || payload.name || payload.email) {
        return {
          user: {
            id: payload.id as string | undefined,
            name: (payload.name as string | undefined) || 'Usuario',
            email: payload.email as string | undefined,
            role: payload.role as string | undefined,
          },
        }
      }

      return { user: null }
    }

    return {
      user: {
        id: userFromPayload.id as string | undefined,
        name: (userFromPayload.name as string | undefined) || 'Usuario',
        email: userFromPayload.email as string | undefined,
        role: userFromPayload.role as string | undefined,
      },
    }
  }

  static async login(credentials: LoginRequestDto): Promise<LoginResponseDto> {
    let lastError: unknown

    for (const baseUrl of this.BASE_URLS) {
      try {
        const response = await httpClient.post<Record<string, unknown>>(
          `${baseUrl}/login`,
          credentials,
          { skipErrorHandler: true },
        )
        return this.normalizeLoginResponse(response.data, credentials)
      } catch (error) {
        lastError = error
      }
    }

    throw lastError
  }

  static async me(): Promise<MeResponseDto> {
    let lastError: unknown
    const profilePaths = ['/me', '/profile', '/check'] as const

    for (const baseUrl of this.BASE_URLS) {
      for (const profilePath of profilePaths) {
        try {
          const response = await httpClient.get<Record<string, unknown>>(
            `${baseUrl}${profilePath}`,
            { skipErrorHandler: true },
          )
          return this.normalizeMeResponse(response.data)
        } catch (error) {
          lastError = error
        }
      }
    }

    throw lastError
  }

  static async logout(): Promise<void> {
    for (const baseUrl of this.BASE_URLS) {
      try {
        await httpClient.post(`${baseUrl}/logout`, null, { skipErrorHandler: true })
        return
      } catch {
        try {
          await httpClient.get(`${baseUrl}/logout`, { skipErrorHandler: true })
          return
        } catch {
          // Continues to next candidate endpoint.
        }
      }
    }
  }
}
