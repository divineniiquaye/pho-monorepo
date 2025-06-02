# Bottom Sheet Router & Manager

A bottom sheet manager inspired by package [react-native-actions-sheet](https://github.com/ammarahm-ed/@repo/bottom-sheet) and adapted to package [@gorhom/bottom-sheet](https://github.com/gorhom/react-native-bottom-sheet).


## Installation

Add it to your project with package.json:

```bash
"@repo/bottom-sheet": "workspace:*"
```

## Usage

`SheetManager` is great because it helps you save lots of development time. One great feature is that you can reuse the same modal sheet in the app and don't have to create or define it in multiple places. Another is that you don't have to write boilerplate for every component. Everything just works.

Import `BottomSheet`.

```tsx
import { BottomSheet } from '@repo/bottom-sheet';
```

Create your BottomSheet component and export it.

```tsx
function ExampleSheet({ id }: SheetProps<"example">) {
  return (
    <BottomSheet id={id}>
      <View>
        <Text>Hello World</Text>
      </View>
    </BottomSheet>
  );
}

export default ExampleSheet;
```

Create a `sheets.tsx` file and import your sheet then register it.

```ts
import {registerSheet} from '@repo/bottom-sheet';
import ExampleSheet from 'example-sheet.tsx';

registerSheet('example-sheet', ExampleSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module '@repo/bottom-sheet' {
  interface Sheets {
    'example-sheet': SheetDefinition;
  }
}

export {};
```

In `App.js` import `sheets.tsx` and wrap your app in `SheetProvider`.

```tsx
import {SheetProvider} from '@repo/bottom-sheet';
import 'sheets.tsx';

function App() {
  return (
    <SheetProvider>
      {
        // your app components
      }
    </SheetProvider>
  );
}
```

Open the modal sheet from anywhere in the app.

```jsx
SheetManager.show('example-sheet');
```

Hide the modal sheet

```jsx
SheetManager.hide('example-sheet');
```

## Examples

The source code for the example (showcase) app is under the [/apps/native/src/sheets/](../../apps/native/src/sheets) directory.

