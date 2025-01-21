"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";

import { Button } from "@repo/design/ui/button";
import { Input } from "@repo/design/ui/input";
import { Text } from "@repo/design/ui/text";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/design/ui/form";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function FormExample() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <View className="border border-border rounded-lg p-4 mt-2 gap-6">
        <FormField
          name="username"
          control={form.control}
          render={({
            field: { name, onChange, value, disabled },
            fieldState: { error },
          }) => (
            <FormItem className="gap-2">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  containerClassName={error && "border-destructive/50"}
                  onBlur={() => form.clearErrors(name)}
                  onChangeText={onChange}
                  placeholder="shadcn"
                  variant="underline"
                  editable={!disabled}
                  value={value}
                />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" onPress={form.handleSubmit(onSubmit)}>
          <Text>Submit</Text>
        </Button>
      </View>
    </Form>
  );
}
