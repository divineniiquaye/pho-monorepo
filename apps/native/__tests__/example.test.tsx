import { render, fireEvent } from "expo-router/testing-library";
import { toast } from "sonner-native";

import { Button, Text } from "@repo/design/ui";

describe("Native component", () => {
  // Mock console.log before each test
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  // Restore console.log after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders text correctly", () => {
    const { getByText, getByRole } = render(<Text role="heading">Boop</Text>);

    expect(getByRole("heading")).toBeTruthy();
    expect(getByText("Boop")).toBeTruthy();
  });
  it("renders text with locale correctly", () => {
    const { getByText } = render(<Text>{i18n.t("Select a theme")}</Text>);
    expect(getByText("Select a theme")).toBeTruthy();
  });

  it("shows toast when button is pressed", () => {
    const { getByText } = render(
      <Button
        onPress={() => {
          toast.custom(<Text>Pressed!</Text>);
          console.log("Pressed!");
        }}
      >
        <Text>Boop</Text>
      </Button>,
    );
    const button = getByText("Boop");

    fireEvent.press(button);
    expect(toast.custom).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Pressed!");
  });
});
