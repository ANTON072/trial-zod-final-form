import { Field, Form } from "react-final-form";
import { z } from "zod";

interface User {
  first_name: string;
  last_name: string;
}

const convertToUser = (values: UserForm): User => {
  const [first_name, ...rest] = values.fullName.split(/[ \u3000]/);
  const last_name = rest.join(" ");
  return {
    first_name,
    last_name,
  };
};

const userFormSchema = z.object({
  fullName: z
    .string({
      message: "氏名は文字列である必要があります",
    })
    .regex(/^.+[ \u3000].+$/, "氏名は少なくとも1つの空白を含む必要があります"),
});

type UserForm = z.infer<typeof userFormSchema>;

const validate = (values: UserForm) => {
  const result = userFormSchema.safeParse(values);
  if (!result.success) {
    // ZodのエラーメッセージをFinal Formの形式に変換
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result.error.issues.reduce((acc: any, curr) => {
      acc[curr.path[0]] = curr.message;
      return acc;
    }, {});
  }

  return undefined;
};

function App() {
  const handleSubmit = (values: UserForm) => {
    const user = convertToUser(values);
    console.log("user", user);
  };

  return (
    <div>
      <Form validate={validate} onSubmit={handleSubmit}>
        {({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit}>
              <div>
                <Field name="fullName">
                  {({ input, meta }) => (
                    <div>
                      <label>フルネーム</label>
                      <input {...input} type="text" />
                      {meta.error && meta.touched && (
                        <div style={{ color: "red" }}>{meta.error}</div>
                      )}
                    </div>
                  )}
                </Field>
              </div>
              <button type="submit">Submit</button>
            </form>
          );
        }}
      </Form>
    </div>
  );
}

export default App;
