import {
  Button,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
} from "@headlessui/react";

function Login() {
  return (
    <div className="flex min-w-[300px] max-w-lg w-1/4 items-center justify-center min-h-screen">
      <div className="max-w-lg w-full min-w-[300px] rounded-xl shadow-lg bg-white/70">
        <Fieldset className="space-y-6 p-6 sm:p-10">
          <Legend className="text-2xl font-bold text-green-700 text-center">
            Login
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
          <Button
            type="submit"
            className="mt-4 w-full bg-orange-500 text-white px-4 py-2 rounded-lg data-[hover]:bg-orange-600 data-[active]:bg-orange-700 transition duration-200 cursor-pointer"
          >
            Log in
          </Button>
        </Fieldset>
      </div>
    </div>
  );
}

export default Login;
