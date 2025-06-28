"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns/format";
import { View } from "react-native";
import { z } from "zod";

import { Input, InputField } from "@repo/design/ui/input";
import { Button } from "@repo/design/ui/button";
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
import { Popover, PopoverContent, PopoverTrigger } from "@repo/design/ui/popover";
import { Calendar as CalendarIcon } from "@repo/design/icons/Calendar";
import { Calendar } from "@repo/design/ui/calender";
import { cn } from "@repo/design/lib/utils";

const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  dob: z.date({ required_error: "A date of birth is required." }),
});

export function FormExample() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "" },
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
              <FormLabel htmlFor="username">Username</FormLabel>
              <FormControl>
                <Input
                  className={`border-0 border-b ${error ? "border-destructive/50" : ""}`}
                  editable={!disabled}
                  size="lg"
                >
                  <InputField
                    onBlur={() => form.clearErrors(name)}
                    onChangeText={onChange}
                    placeholder="shadcn"
                    value={value}
                  />
                </Input>
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <FormControl asChild>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] flex-row items-center pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <Text>
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                      </Text>
                      <CalendarIcon className="ml-auto size-5 opacity-50 text-foreground" />
                    </Button>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className="max-w-[320px] p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
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
