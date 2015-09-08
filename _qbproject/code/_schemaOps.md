```scala
// Combine Schemas
val urgentIssueSchema = issueSchema + qbClass(
    "urgency" -> qbEnum("foo", "meh")
)

// make attributes optional
val noReporterSchema = 
  urgentIssueSchema ? "reporter"

```