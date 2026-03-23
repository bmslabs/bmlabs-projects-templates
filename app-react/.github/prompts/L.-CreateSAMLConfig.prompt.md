---
agent: agent
name: "CreateSAMLIntegration"
description: "Generate SAML configuration and setup for enterprise SSO authentication"
tools: [execute, read, edit, search, web, agent, todo]
argument-hint: "No arguments required - generates complete SAML setup and documentation"
---

# Integrar SAML para Enterprise SSO

## Role
You are a backend and authentication expert specializing in enterprise identity management. You understand SAML 2.0 protocols, SSO flows, and federated identity management.

## Goal
Generate complete SAML integration setup that:
- Configures SAML 2.0 service provider
- Handles SAML assertion validation
- Manages SSO login flow
- Maps SAML attributes to user data
- Supports multiple identity providers (IdPs)
- Provides configuration documentation
- Includes error handling for SAML failures

## Output Requirements

### 1. `backend/src/auth/saml.config.ts` (Backend - Node/Express)
Must include:
- SAML configuration object with:
  - Environment variables for IdP details
  - Service provider metadata
  - Assertion decryption settings
  - Attribute mapping configuration
- SAMLConfig interface defining structure
- getSAMLMetadata() function
- getSAMLConfig() function
- Methods to validate SAML credentials

Example config:
```typescript
const samlConfig = {
  idp: {
    singleSignOnService: process.env.SAML_IDP_SSO_URL,
    singleLogoutService: process.env.SAML_IDP_SLO_URL,
    certificate: process.env.SAML_IDP_CERTIFICATE,
  },
  sp: {
    entityId: process.env.SAML_SP_ENTITY_ID,
    assertionConsumerService: {
      url: process.env.SAML_SP_ACS_URL,
      binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
    }
  },
  attributeMapping: {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': 'email',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'name',
    'http://..../role': 'roles',
  },
};
```

### 2. `backend/src/auth/saml.service.ts` (SAML Service)
Must include:
- SAMLAuthService class with:
  - validateSAMLResponse(samlResponse) - Validate SAML assertion
  - parseSAMLAttributes(assertion) - Extract user data from SAML
  - createOrUpdateUser(samlData) - Create/update user from SAML data
  - generateSAMLRequest() - Generate authentication request
  - getSAMLMetadata() - Return SP metadata XML
- Error handling:
  - Invalid signature
  - Expired assertion
  - Missing attributes
  - IdP mismatch
- JSD OC comments for all methods

Example methods:
```typescript
async validateSAMLResponse(samlResponse: string): Promise<SAMLUser> {
  const decodedResponse = Buffer.from(samlResponse, 'base64').toString();
  const assertion = await validateSignature(decodedResponse);
  
  if (Date.now() > assertion.expiresAt) {
    throw new Error('SAML assertion expired');
  }
  
  return parseSAMLAttributes(assertion);
}
```

### 3. `backend/src/auth/saml.routes.ts` (SAML Routes)
Must include routes:
- POST /auth/saml/login - Initiate SAML login
  - Generate SAML auth request
  - Redirect to IdP SSO URL
- POST /auth/saml/acs - Assertion Consumer Service (callback)
  - Receive SAML response from IdP
  - Validate assertion
  - Create/update user
  - Generate JWT tokens
  - Redirect to frontend with tokens
- GET /auth/saml/metadata - Export SP metadata
- POST /auth/saml/logout - SAML logout

### 4. `.env.example` (Environment Configuration)
Must include SAML variables:
```env
# SAML Configuration
SAML_IDP_SSO_URL=https://idp.example.com/sso
SAML_IDP_SLO_URL=https://idp.example.com/slo
SAML_IDP_CERTIFICATE=-----BEGIN CERTIFICATE-----...
SAML_IDP_ENTITY_ID=https://idp.example.com

SAML_SP_ENTITY_ID=https://app.example.com
SAML_SP_ACS_URL=https://app.example.com/api/auth/saml/acs
SAML_SP_CERTIFICATE=-----BEGIN CERTIFICATE-----...
SAML_SP_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
```

### 5. `docs/SAML_SETUP.md` (Setup Documentation)
Must include:
- Overview of SAML 2.0 and SSO
- Prerequisites:
  - IdP configuration (Azure AD, Okta, etc.)
  - Identity provider URL and certificate
  - Service provider metadata generation
- Step-by-step setup:
  1. Generate SP certificate/key pair
  2. Configure IdP with SP metadata
  3. Set environment variables
  4. Test SAML login flow
- Supported Identity Providers:
  - Azure AD / Entra ID
  - Okta
  - Google Workspace
  - AWS Single Sign-On
  - Custom SAML providers
- Troubleshooting:
  - Invalid signature errors
  - Certificate expiration
  - Attribute mapping issues
  - Expired assertions

## SAML Attribute Mapping

Support these standard SAML attributes:
```
Subject/NameID → User Email
http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name → Name
http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress → Email
http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role → Roles
Custom attributes → Custom fields
```

## Security Requirements
- Validate all SAML signatures
- Check assertion timestamps and expiration
- Validate IdP certificate chain
- Use HTTPS only for ACS endpoint
- Implement replay attack prevention
- Log all SAML authentication events
- Encrypt sensitive attributes-in transit

## Frontend Integration

In your AuthService:
```typescript
async validateSAML(samlResponse: string): Promise<AuthResponse> {
  return await apiClient.post('/auth/saml/login', { samlResponse });
}

async getSAMLMetadata(): Promise<{ metadataUrl: string }> {
  return await apiClient.get('/auth/saml/metadata');
}
```

In LoginPage:
```typescript
<button onClick={() => window.location.href = '/api/auth/saml/login'}>
  Sign in with Corporate Account (SAML)
</button>
```

## Acceptance Criteria
- ✅ SAML config uses environment variables
- ✅ validateSAMLResponse checks signature
- ✅ validateSAMLResponse checks expiration
- ✅ User is created/updated automatically
- ✅ JWT tokens issued after SAML success
- ✅ SP metadata endpoint functional
- ✅ Error handling for all SAML failures
- ✅ Supports multiple SAML IdPs
- ✅ Logout flow implemented
- ✅ Documentation covers Azure, Okta, Google

## Supported Identity Providers
- ✅ Azure Active Directory / Entra ID
- ✅ Okta
- ✅ Google Workspace
- ✅ AWS Single Sign-On (SSO)
- ✅ Ping Identity
- ✅ OneLogin
- ✅ Custom SAML providers

---

**Backend Framework**: Node.js + Express (with passport-saml)  
**SAML Library**: passport-saml or saml2-js  
**Prerequisite**: AuthContext and AuthService created  
**Documentation**: SAML_SETUP.md with enterprise setup guides  
