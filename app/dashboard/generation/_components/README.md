# GlobalGenerationPanel - Refactored Architecture

This component has been refactored from a monolithic 1000+ line file into a modular, maintainable architecture following modern Next.js/React patterns.

## 📁 Structure

```
_components/
├── GlobalGenerationPanel.tsx          # Main orchestrator component
├── GlobalGenerationPanel.old.tsx      # Original file (backup)
├── translations.ts                    # i18n translations
├── types.ts                          # TypeScript type definitions
├── utils.ts                          # Pure utility functions
├── hooks/                            # Custom React hooks (business logic)
│   ├── index.ts
│   ├── useGenerationState.ts        # Redis state persistence
│   ├── useEntitlement.ts            # Quota/limits management
│   ├── useGoogleSearch.ts           # Google Places search
│   ├── useUrlCrawl.ts               # URL crawling logic
│   ├── usePreviewGeneration.ts      # Preview building
│   └── useCrawlJob.ts               # Polling logic
└── ui/                               # Presentational components
    ├── index.ts
    ├── SourceTypeToggle.tsx         # Google/URL toggle
    ├── GoogleSearchForm.tsx         # Search form + results
    ├── UrlCrawlForm.tsx             # URL input form
    ├── BusinessSelector.tsx         # Business dropdown
    ├── BlockSelector.tsx            # Profile/Services/Hours selector
    └── PreviewCards.tsx             # Preview display cards
```

## 🎯 Design Principles

### 1. Separation of Concerns
- **Hooks**: Business logic, API calls, state management
- **UI Components**: Pure presentation, no business logic
- **Utils**: Pure functions, no side effects
- **Types**: Centralized type definitions

### 2. Single Responsibility
Each file has one clear purpose:
- `useGoogleSearch` → Only handles Google Places search
- `GoogleSearchForm` → Only renders search UI
- `translations.ts` → Only contains i18n strings

### 3. Composition over Inheritance
Components are composed together in the main file, making the data flow explicit and easy to follow.

### 4. Custom Hooks Pattern
Business logic is extracted into reusable hooks:
```tsx
const googleSearch = useGoogleSearch(locale, t.errorSearch)
// Returns: { form, isSearching, googleResults, handleSearch, setGoogleResults }
```

### 5. Prop Drilling Minimization
Each component receives only the props it needs, with clear interfaces.

## 🔧 Key Improvements

### Before (Monolithic)
- ❌ 1000+ lines in one file
- ❌ Mixed concerns (UI + logic + state)
- ❌ Hard to test individual pieces
- ❌ Difficult to understand data flow
- ❌ Translations embedded in component
- ❌ State cleanup only in Redis, not local state

### After (Modular)
- ✅ ~200 lines per file (max)
- ✅ Clear separation of concerns
- ✅ Each piece is independently testable
- ✅ Explicit data flow
- ✅ Centralized translations
- ✅ Reusable hooks
- ✅ Type-safe throughout
- ✅ Complete state cleanup (Redis + local state) on success

### State Management
The component now properly cleans up ALL state when:
- ✅ User creates a new business from preview
- ✅ User applies changes to an existing business
- ✅ Clears both Redis persistence AND local component state
- ✅ Resets to initial state for next generation

## 📚 Usage Examples

### Using Custom Hooks

```tsx
// Google Search
const googleSearch = useGoogleSearch(locale, errorMessage)
await googleSearch.handleSearch({ query: 'Restaurant' })
console.log(googleSearch.googleResults)

// URL Crawl
const urlCrawl = useUrlCrawl(locale, errorMessage)
await urlCrawl.handleCrawl({ url: 'https://example.com' }, onSuccess)

// Preview Generation
const preview = usePreviewGeneration(locale, errorMessage)
await preview.buildPreview('google', data, onSuccess)
```

### Using UI Components

```tsx
<GoogleSearchForm
  form={googleSearch.form}
  isSearching={googleSearch.isSearching}
  googleResults={googleSearch.googleResults}
  onSubmit={handleSearch}
  onSelectResult={handleSelectResult}
  labels={translations}
/>
```

## 🧪 Testing Strategy

Each module can now be tested independently:

```tsx
// Test hooks
import { renderHook } from '@testing-library/react-hooks'
import { useGoogleSearch } from './hooks/useGoogleSearch'

test('handles search correctly', async () => {
  const { result } = renderHook(() => useGoogleSearch('es', 'Error'))
  await result.current.handleSearch({ query: 'test' })
  expect(result.current.googleResults).toHaveLength(5)
})

// Test UI components
import { render } from '@testing-library/react'
import { GoogleSearchForm } from './ui/GoogleSearchForm'

test('renders search form', () => {
  const { getByPlaceholderText } = render(<GoogleSearchForm {...props} />)
  expect(getByPlaceholderText('Search...')).toBeInTheDocument()
})
```

## 🔄 Migration Notes

The original file is preserved as `GlobalGenerationPanel.old.tsx` for reference. The new implementation maintains 100% feature parity with the original.

### Breaking Changes
None - the public API remains identical.

### Performance Improvements
- Better code splitting potential
- Smaller bundle sizes per chunk
- Improved tree-shaking

## 🚀 Future Enhancements

With this new structure, it's now easy to:
1. Add new source types (e.g., Yelp, TripAdvisor)
2. Create new UI variants
3. Add comprehensive tests
4. Extract hooks to a shared library
5. Implement feature flags per section
6. Add analytics per interaction

## 📖 Related Patterns

This refactoring follows these modern React patterns:
- **Custom Hooks Pattern**: Logic extraction
- **Compound Components**: Flexible composition
- **Controlled Components**: Explicit state management
- **Container/Presenter**: Separation of concerns
- **Dependency Injection**: Props over context
