import { render, fireEvent } from "@testing-library/react-native";
import { toast } from "sonner-native";

jest.useFakeTimers();

// eslint-disable-next-line import/first
import Native from "../app/index";

// Mock the dependencies
jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"));
jest.mock("lucide-react-native", () => ({ AlertTriangle: "AlertTriangle" }));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 47 }),
}));
jest.mock("sonner-native", () => ({
  toast: { custom: jest.fn() },
  ToastProvider: ({ children }: React.PropsWithChildren) => children,
}));
jest.mock("@repo/ui/themed/select", () => ({
  Select: ({ children }: React.PropsWithChildren) => children,
  SelectContent: ({ children }: React.PropsWithChildren) => children,
  SelectItem: ({ children }: React.PropsWithChildren) => children,
  SelectTrigger: ({ children }: React.PropsWithChildren) => children,
  SelectValue: ({ children }: React.PropsWithChildren) => children,
}));

describe("Mocks", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("mocks the dependencies", () => {
    expect(require("react-native-safe-area-context")).toBeDefined();
    expect(require("react-native-reanimated")).toBeDefined();
    expect(require("lucide-react-native")).toBeDefined();
    expect(require("sonner-native")).toBeDefined();
  });
});

describe("Native component", () => {
  // Mock console.log before each test
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  // Restore console.log after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders correctly", () => {
    const { getByText, getByRole } = render(<Native />);

    expect(getByRole("heading")).toBeTruthy();
    expect(getByText("Native")).toBeTruthy();
    expect(getByText("Boop")).toBeTruthy();
  });

  it("shows toast when button is pressed", () => {
    const { getByText } = render(<Native />);
    const button = getByText("Boop");

    fireEvent.press(button);

    expect(toast.custom).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Pressed!");
  });
});
