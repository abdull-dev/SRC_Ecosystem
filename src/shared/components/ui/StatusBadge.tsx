const config = {
  completed: { label: 'Completed', classes: 'bg-success-subtle text-success ring-1 ring-success-border'   },
  pending:   { label: 'Pending',   classes: 'bg-warning-subtle text-warning ring-1 ring-warning-border'   },
  failed:    { label: 'Failed',    classes: 'bg-danger-subtle text-danger ring-1 ring-danger-border'       },
  active:    { label: 'Active',    classes: 'bg-success-subtle text-success ring-1 ring-success-border'   },
  inactive:  { label: 'Inactive',  classes: 'bg-surface text-ink-muted ring-1 ring-line'                  },
}

export default function StatusBadge({ status }: { status: string }) {
  const { label, classes } = config[status as keyof typeof config] ?? {
    label: status,
    classes: 'bg-surface text-ink-muted ring-1 ring-line',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {label}
    </span>
  )
}
