# Perf Assist - Mock Data and Prompt Generation

This project contains mock data and a prompt template for generating performance summaries in the Perf Assist application.

## Contents

1. **mock_entries.md** - Contains 1.5 months of mock entries (plans and facts) from December 15, 2025, to January 31, 2026. These entries cover various aspects of software engineering work including:
   - API optimization and performance improvements
   - System architecture enhancements
   - Documentation improvements
   - Team collaboration and code reviews
   - Integration with monitoring and notification systems
   - Technical interviews and team onboarding

2. **perf_summary_prompt.md** - Contains a detailed prompt for an LLM to generate performance summaries from daily entries. The prompt follows the Context/Outputs/Outcomes format as specified in the Perf Assist project requirements.

## How to Use

### Using the Mock Entries

The mock entries can be used to test the performance summary generation functionality of the Perf Assist backend. To use these entries:

1. Parse the entries from `mock_entries.md`
2. Convert them to the Entry data structure used by the Perf Assist backend:
   ```json
   {
     "id": "uuid",
     "date": "2025-12-15",
     "type": "plan", // or "fact"
     "text": "Сегодня планирую начать работу над оптимизацией производительности API...",
     "created_at": "2025-12-15T09:00:00Z"
   }
   ```
3. Store them in the database
4. Use them as input for the performance summary generation endpoint

### Using the Performance Summary Prompt

The prompt in `perf_summary_prompt.md` can be used by the LLM component of the Perf Assist backend to generate performance summaries. To use this prompt:

1. Extract the system prompt and guidelines
2. Format the user's entries according to the input format specified in the prompt
3. Send the formatted input to the LLM along with the prompt
4. Parse the JSON response to extract the generated goals with their Context/Outputs/Outcomes

## Performance Summary Format

The generated performance summaries follow this structure:

```json
{
  "goals": [
    {
      "title": "Concise title of the goal/project",
      "context": "1-3 paragraphs explaining the background, problems, or opportunities",
      "outputs": [
        "Bullet point describing a specific action or deliverable",
        "Another action or deliverable"
      ],
      "outcomes": [
        "Bullet point describing a result or impact",
        "Another result or impact"
      ]
    }
  ]
}
```

## Role-Based Considerations

The prompt is designed to adapt the generated summaries based on the user's role:
- **Engineer**: Emphasizes technical work, code, architecture, infrastructure
- **Team Lead/Manager**: Focuses on processes, team coordination, decisions, facilitation

## Customization

You can customize the mock entries and prompt for different scenarios:
1. Adjust the time period by modifying the dates in the mock entries
2. Change the domain or industry focus by rewriting the entry content
3. Modify the role emphasis by adjusting the guidelines in the prompt
4. Add new types of work activities by extending the entry examples

## Testing the System

To test the complete system:

1. Load the mock entries into the database
2. Configure the LLM component with the provided prompt
3. Call the performance summary generation endpoint with a date range
4. Verify that the generated summary follows the Context/Outputs/Outcomes format
5. Check that the summary accurately reflects the work described in the entries

## Further Development

This mock data and prompt can be extended to:
- Include more diverse work scenarios
- Support additional user roles
- Add multilingual support
- Incorporate more sophisticated grouping algorithms
- Add support for different performance review cycles