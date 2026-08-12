# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 3.x     | :white_check_mark: |
| 2.x     | :x:                |

## Known Security Issues

### Modernizr 2.8.3 and Earlier

**Issue**: Dynamic code execution via `Function()` constructor
**Severity**: Medium
**Status**: Fixed in 3.x

Modernizr versions 2.8.3 and earlier contain code patterns that use the `Function()` constructor for dynamic code execution, which can trigger security scanners like SonarQube.

**Example problematic code**:
```javascript
ownerDocument.createDocumentFragment = Function('h,f', 'return function(){');
```

**Recommendation**: Upgrade to Modernizr 3.x which removes these patterns and uses safer alternatives.

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by:

1. **Do not** open a public issue
2. Email the maintainers directly
3. Include detailed information about the vulnerability
4. Allow reasonable time for the issue to be addressed

We take security seriously and will respond to legitimate security reports promptly.

## Security Best Practices

When using Modernizr:

1. Always use the latest stable version (3.x)
2. Use custom builds to include only needed feature detects
3. Regularly update dependencies
4. Monitor security advisories

For more information, visit our [documentation](https://modernizr.com/docs/).