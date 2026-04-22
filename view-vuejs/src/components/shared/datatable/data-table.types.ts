import type { Component } from 'vue'

export interface DataTableRow {
  id?: string | number
  [key: string]: unknown
}

export interface TableFilterOption {
  value: unknown
  label: string
}

export interface TableColumn {
  key: string
  label: string
  hidden?: string
  sortable?: boolean
  filterable?: boolean
  filterType?: 'text' | 'date' | 'dateRange' | 'select' | 'multiselect' | 'number'
  filterOptions?: TableFilterOption[]
  price?: boolean
  type?: 'text' | 'select' | 'custom' | 'date' | 'rejectedAlert'
  badge?: boolean
  badgeColor?: string
  options?: TableFilterOption[]
  render?: Component
  sticky?: boolean
  minWidth?: string
  maxWidth?: string
  clickable?: boolean
  textColor?: string
}

export interface TableAction {
  key: string
  title?: string
  iconComponent?: Component
  iconClass?: string
  class?: string
  show?: (row: unknown) => boolean
}