import type { EditUserByUid, UpdateUserInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  Submit,
} from '@redwoodjs/forms'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

type FormUser = NonNullable<EditUserByUid['user']>

interface UserFormProps {
  user?: EditUserByUid['user']
  onSave: (data: UpdateUserInput, uid?: FormUser['uid']) => void
  error: RWGqlError
  loading: boolean
}

const UserForm = (props: UserFormProps) => {
  const onSubmit = (data: FormUser) => {
    props.onSave(data, props?.user?.uid)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormUser> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="first_name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          First name
        </Label>

        <TextField
          name="first_name"
          defaultValue={props.user?.first_name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="first_name" className="rw-field-error" />

        <Label
          name="surname"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Surname
        </Label>

        <TextField
          name="surname"
          defaultValue={props.user?.surname}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="surname" className="rw-field-error" />

        <Label
          name="email"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Email
        </Label>

        <TextField
          name="email"
          defaultValue={props.user?.email}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="email" className="rw-field-error" />

        <Label
          name="role"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Role
        </Label>

        <TextField
          name="role"
          defaultValue={props.user?.role}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="role" className="rw-field-error" />

        <Label
          name="font_preference"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Font preference
        </Label>

        <TextField
          name="font_preference"
          defaultValue={props.user?.font_preference}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="font_preference" className="rw-field-error" />

        <Label
          name="creation_timestamp"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Creation timestamp
        </Label>

        <DatetimeLocalField
          name="creation_timestamp"
          defaultValue={formatDatetime(props.user?.creation_timestamp)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="creation_timestamp" className="rw-field-error" />

        <Label
          name="last_login"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Last login
        </Label>

        <DatetimeLocalField
          name="last_login"
          defaultValue={formatDatetime(props.user?.last_login)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="last_login" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default UserForm
