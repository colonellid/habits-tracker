interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="card border-todoist-red/20 bg-red-50 text-todoist-red text-sm p-4 flex items-center gap-2">
      <span>⚠️</span>
      <span>{message}</span>
    </div>
  )
}
