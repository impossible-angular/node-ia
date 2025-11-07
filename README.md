## Node.js examples
- [Run *.ts files](#run-ts-files)
- [Main thread starvation](#main-thread-starvation)

### Run *.ts files

**Briefly**
The `--experimental-strip-types` flag was an experimental command-line option in Node.js
that enabled the direct execution of TypeScript (.ts) files by automatically removing type annotations at runtime.
(e.g., v23.6.0 and later, or v22.18.0 and later in the LTS), type stripping is enabled by default when running .ts files

```shell
node --experimental-strip-types [file.ts]
```
Example:
```shell
mkdir node-ts && cd node-ts
npm init --yes
echo "console.log('Hello NodeTS.')" > 'server.ts'
node --experimental-strip-types server.ts
```
Example for dev:
```shell
mkdir node-dev && cd node-dev
npm init --yes
npm install express
npm install --save-dev typescript @types/node @types/express
npx tsc --init
```
Add to package.json `"type": "module"`

Add to tsconfig.json
```
"module": "ES2022",
"target": "ES2022",
"allowSyntheticDefaultImports": true,
"moduleResolution": "node",
"allowImportingTsExtensions": true
```

### Main thread starvation
[**Source project:** main-thread-starvation](main-thread-starvation)

**Briefly**

Simulate main thread starvation in Node.js, and use a profiler to locate the bottleneck. Then, employ a worker thread (or Worker) to prevent the main thread from starving.

**Usage:**

Serve and debug.
```bash
node --inspect main-thread-starvation/server.ts
```

Serve with performance profile.
```bash
node --prof main-thread-starvation/server.ts
```

Parse profile to find bottleneck.
```bash
node --prof-process [isolate-xxxxxxx-xxxx-v8.log] > processed.txt
```

**Details**

**In browser:**

To block main thread for 30s run:
```
http://localhost:3000/fibonacci-block/45
```

To see how main thread block other request just open random api in same time in second tab.
```
http://localhost:3000/random
```

To avoid block main thread use worker. It will run for 30s but not blocks other api.
```
http://localhost:3000/fibonacci/45
```
