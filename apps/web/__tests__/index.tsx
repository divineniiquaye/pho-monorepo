import { fireEvent, render } from "@testing-library/react";
import { toast } from "sonner-native";

import Web from "../app/page";

// Mock the dependencies
jest.mock("lucide-react-native", () => ({ AlertTriangle: () => <svg /> }));
jest.mock("@repo/ui/themed/select", () => ({ Select: "Select" }));
jest.mock("react-native-reanimated", () => ({
  View: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
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
    const { getByText, getByRole } = render(<Web />);

    expect(getByRole("heading")).toBeInTheDocument();
    expect(getByRole("heading")).toBeTruthy();
    expect(getByText("Web")).toBeTruthy();
    expect(getByText("Boop")).toBeTruthy();
  });

  it("shows toast when button is pressed", () => {
    const { getByText } = render(<Web />);
    const button = getByText("Boop");

    fireEvent.click(button);

    expect(toast.custom).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Pressed!");
  });
});
