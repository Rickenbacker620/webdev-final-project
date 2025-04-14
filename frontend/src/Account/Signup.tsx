import {
  Button,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
} from "@headlessui/react";

function Signup() {
  return (
    <div className="flex min-w-[300px] max-w-lg w-1/4 items-center justify-center min-h-screen">
      <div className="w-full rounded-2xl shadow-lg bg-gray-50/80">
        <Fieldset className="space-y-6 p-6 sm:p-10">
          <Legend className="text-2xl font-bold text-green-700 text-center">
            Sign Up
          </Legend>
          <Field>
            <Label className="block text-sm font-medium text-green-600">
              Email
            </Label>
            <Input
              type="email"
              className="mt-3 block w-full rounded-lg border border-green-300 px-3 py-2 text-sm text-green-700"
              placeholder="Enter your email"
            />
          </Field>
          <Field>
            <Label className="block text-sm font-medium text-green-600">
              Password
            </Label>
            <Input
              type="password"
              className="mt-3 block w-full rounded-lg border border-green-300 px-3 py-2 text-sm text-green-700"
              placeholder="Enter your password"
            />
          </Field>
          <Field>
            <Label className="block text-sm font-medium text-green-600">
              Confirm Password
            </Label>
            <Input
              type="password"
              className="mt-3 block w-full rounded-lg border border-green-300 px-3 py-2 text-sm text-green-700"
              placeholder="Confirm your password"
            />
          </Field>
          <Button
            type="submit"
            className="mt-4 w-full bg-orange-500 text-white px-4 py-2 rounded-2xl data-[hover]:bg-orange-600 data-[active]:bg-orange-700 transition duration-200"
          >
            Sign Up
          </Button>
        </Fieldset>
      </div>
    </div>
  );
}

export default Signup;
