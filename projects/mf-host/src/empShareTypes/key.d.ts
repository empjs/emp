,
  "engines": {
    "node": ">= 10.0"
  },
  "dependencies": {
    "commander": "^8.3.0",
    "cross-fetch": "^3.1.4",
    "debug": "^4.3.3",
    "glob": "^7.2.0",
    "https-proxy-agent": "^5.0.0",
    "js-yaml": "^4.1.0",
    "tslib": "^2.3.1",
    "typescript": "^4.5.2"
  },
  "devDependencies": {
    "@dtsgenerator/do-nothing": "^2.5.1",
    "@dtsgenerator/eslint-config": "^0.5.0",
    "@dtsgenerator/replace-namespace": "^1.5.1",
    "@dtsgenerator/single-quote": "^1.6.1",
    "@istanbuljs/nyc-config-typescript": "^1.0.2",
    "@types/debug": "^4.1.7",
    "@types/glob": "^7.2.0",
    "@types/js-yaml": "^4.0.5",
    "@types/mkdirp": "^1.0.2",
    "@types/mocha": "^9.0.0",
    "@types/node": "^16.11.12",
    "cross-env": "^7.0.3",
    "eslint": "^8.4.1",
    "husky": "^7.0.4",
    "lint-staged": "^12.1.2",
    "mocha": "^9.1.3",
    "nyc": "^15.1.0",
    "prettier": "^2.5.1",
    "rimraf": "^3.0.2",
    "source-map-support": "^0.5.21",
    "ts-node": "^10.4.0"
  },
  "lint-staged": {
    "**/*.ts": [
      "prettier --write",
      "eslint --fix"
    ]
  }
}
