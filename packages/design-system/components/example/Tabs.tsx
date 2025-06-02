"use client";

import { View } from "react-native";
import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/design/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/design/ui/tabs";
import { Button } from "@repo/design/ui/button";
import { Input, InputField } from "@repo/design/ui/input";
import { Label } from "@repo/design/ui/label";
import { Text } from "@repo/design/ui/text";

export function TabsExample() {
  const [value, setValue] = React.useState("account");
  const [value2, setValue2] = React.useState("");
  return (
    <View className="flex-1 justify-center p-6">
      <Tabs
        value={value}
        onValueChange={setValue}
        className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
      >
        <TabsList className="flex-row w-full">
          <TabsTrigger value="account" className="flex-1">
            <Text>Account</Text>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex-1">
            <Text>Password</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-4 native:gap-2">
              <View className="gap-1">
                <Label nativeID="name">Name</Label>
                <Input>
                  <InputField aria-aria-labelledby="name" defaultValue="Pedro Duarte" />
                </Input>
              </View>
              <View className="gap-1">
                <Label nativeID="username">Username</Label>
                <Input>
                  <InputField id="username" defaultValue="@peduarte" />
                </Input>
              </View>
            </CardContent>
            <CardFooter>
              <Button>
                <Text>Save changes</Text>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-4 native:gap-2">
              <View className="gap-1">
                <Input label="Current password">
                  <InputField
                    secureTextEntry
                    value={value2}
                    onChangeText={setValue2}
                    aria-labelledby="current"
                  />
                </Input>
              </View>
              <View className="gap-1">
                <Label nativeID="new">New password</Label>
                <Input>
                  <InputField
                    placeholder="********"
                    aria-labelledby="new"
                    secureTextEntry
                  />
                </Input>
              </View>
            </CardContent>
            <CardFooter>
              <Button>
                <Text>Save password</Text>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </View>
  );
}
