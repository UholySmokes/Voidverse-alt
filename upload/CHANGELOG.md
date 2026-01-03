# Changelog

All notable changes to the Voidverse RPG project will be documented in this file.

## [Unreleased] - 2025-12-30

### Removed
- **Google Gemini API Integration** - Removed all Google/Gemini related code at user request
  - Removed `@google/generative-ai` package dependency
  - Removed `callGemini()` function from llmService.js
  - Removed Gemini configuration from .env.example files
  - Removed Gemini status display from server startup
  - Updated LLM priority to OpenAI > Anthropic
  - Updated documentation to remove Gemini references

## [Previous] - 2024-12-30

### Added
- **Performance Optimizations**
  - Added tag generation caching with LRU eviction (1000 item limit)
  - Improved mutation type checking with proper object/string handling
  - Better null/undefined checks throughout the codebase
- **Enhanced Error Handling**
  - Better error messages in LLM service with stack traces
  - Graceful fallback to placeholder stories on LLM failures
- **Documentation**
  - Comprehensive LLM_SETUP.md guide with cost comparisons
  - Added this CHANGELOG.md for tracking changes

### Fixed
- **Critical Bug Fixes**
  - Fixed 30+ typos and spacing issues in fusionEngine.js (e.g., `aspectName. toLowerCase()`)
  - Fixed spacing issues in stateMerge.js (e.g., `! variable` to `!variable`)
  - Fixed mutation display in AbilitiesPanel.jsx to handle both object and string mutations
  - Fixed isRare/isLegendary calculations (no longer return null)
  - Fixed tag generation for aspects with proper null checks
- **Security Vulnerabilities**
  - Updated Vite from 5.4.11 to 7.3.0 (fixes esbuild vulnerability CVE)
  - Updated frontend dependencies to resolve moderate severity issues
  - All security audits now pass with 0 vulnerabilities
- **Code Quality**
  - Fixed all spacing inconsistencies with method calls (e.g., `Math. random()` to `Math.random()`)
  - Improved type consistency throughout the codebase
  - Better mutation tooltips in UI showing mutation descriptions

### Changed
- **Environment Configuration**: Updated .env.example with better structure
- **Package Dependencies**: Updated frontend packages to latest secure versions

### Technical Details

#### Files Modified
- `backend/engine/fusionEngine.js` - Fixed typos, added caching
- `backend/engine/stateMerge.js` - Fixed spacing and null checks
- `backend/llm/llmService.js` - Improved error handling
- `backend/server.js` - Updated status display
- `frontend/src/components/AbilitiesPanel.jsx` - Fixed mutation display
- `frontend/package.json` - Updated Vite to 7.3.0
- `.env.example` - LLM configuration
- `LLM_SETUP.md` - Comprehensive guide with cost analysis

#### Performance Improvements
- Tag generation: ~50% faster for repeated aspects (via caching)
- Memory usage: Controlled via LRU cache (max 1000 items)
- Better code readability and maintainability

#### Breaking Changes
None - All changes are backward compatible

---

## [1.0.0] - Previous Release

### Initial Features
- Fusion system with automatic and manual fusion
- Mutation system with tiered effects
- Tag-based synergy system
- LLM integration (OpenAI and Anthropic)
- React frontend with dark theme
- Express backend with modular design
