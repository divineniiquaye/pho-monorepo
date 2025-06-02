// Mock imports
import "react-native-gesture-handler/jestSetup";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"));

// Mock React native keyboard controller
jest.mock("react-native-keyboard-controller", () =>
    require("react-native-keyboard-controller/jest"),
);

// Mock safe area insets
jest.mock("react-native-safe-area-context", () => ({
    useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 47 }),
}));

// Mock hack for react-native-css-interop
jest.mock(
    "react-native-css-interop/src/runtime/third-party-libs/react-native-safe-area-context",
    () => ({
        maybeHijackSafeAreaProvider: (type: any) => type,
    }),
);

// Mock react-native-svg
jest.mock("react-native-svg", () => {
    const mockSvg = () => "Svg";
    mockSvg.Circle = () => "Circle";
    mockSvg.Rect = () => "Rect";
    mockSvg.Path = () => "Path";
    mockSvg.G = () => "G";
    mockSvg.Defs = () => "Defs";
    mockSvg.LinearGradient = () => "LinearGradient";
    mockSvg.Stop = () => "Stop";

    return mockSvg;
});

// Mock sonner-native
jest.mock("sonner-native", () => ({
    toast: { custom: jest.fn() },
    ToastProvider: ({ children }: { children: any }) => children,
}));

// Mock gohom bottom-sheet
jest.mock("@gorhom/bottom-sheet", () => require("@gorhom/bottom-sheet/mock"));

// Mock lucide-react-native
// jest.mock("lucide-react-native", () => ({ ChevronDown: "ChevronDown" }));
