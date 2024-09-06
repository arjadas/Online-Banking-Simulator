import type { EditMockUserByUid, UpdateMockUserInput } from 'types/graphql'

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

type FormMockUser = NonNullable<EditMockUserByUid['mockUser']>

interface MockUserFormProps {
  mockUser?: EditMockUserByUid['mockUser']
  onSave: (data: UpdateMockUserInput, uid?: FormMockUser['uid']) => void
  error: RWGqlError
  loading: boolean
}

const MockUserForm = (props: MockUserFormProps) => {
  const onSubmit = (data: FormMockUser) => {
    props.onSave(data, props?.mockUser?.uid)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormMockUser> onSubmit={onSubmit} error={props.error}>
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
          defaultValue={props.mockUser?.first_name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
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
          defaultValue={props.mockUser?.surname}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="surname" className="rw-field-error" />

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextField
          name="description"
          defaultValue={props.mockUser?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="creation_timestamp"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Creation timestamp
        </Label>

        <DatetimeLocalField
          name="creation_timestamp"
          defaultValue={formatDatetime(props.mockUser?.creation_timestamp)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="creation_timestamp" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default MockUserForm
