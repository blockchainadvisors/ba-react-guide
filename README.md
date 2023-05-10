# ba-react-guide

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/ba-react-guide.svg)](https://www.npmjs.com/package/ba-react-guide) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install ba-react-guide
```

## Usage

```tsx
import React, { Component } from 'react'

import Guide from 'ba-react-guide'

class Example extends Component {
  render() {
    // If you are using this component on multiple sites, use unique storageKey to prevent overlap
    return <Guide csvFile="https://blockchainadvisors.ltd/some-file.csv" storageKey="KEY_GUIDE" />
  }
}
```

## License

MIT © [waqaarali](https://github.com/waqaarali)