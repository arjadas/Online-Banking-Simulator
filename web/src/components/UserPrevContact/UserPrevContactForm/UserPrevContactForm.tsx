import type {
  EditUserPrevContactByUserId,
  UpdateUserPrevContactInput,
} from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormUserPrevContact = NonNullable<
  EditUserPrevContactByUserId['userPrevContact']
>

interface UserPrevContactFormProps {
  userPrevContact?: EditUserPrevContactByUserId['userPrevContact']
  onSave: (
    data: UpdateUserPrevContactInput,
    user_id?: FormUserPrevContact['user_id']
  ) => void
  error: RWGqlError
  loading: boolean
}

const UserPrevContactForm = (props: UserPrevContactFormProps) => {
  const onSubmit = (data: FormUserPrevContact) => {
    props.onSave(data, props?.userPrevContact?.user_id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormUserPrevContact> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="contact_acc"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Contact acc
        </Label>

        <NumberField
          name="contact_acc"
          defaultValue={props.userPrevContact?.contact_acc}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="contact_acc" className="rw-field-error" />

        <Label
          name="contact_acc_name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Contact acc name
        </Label>

        <TextField
          name="contact_acc_name"
          defaultValue={props.userPrevContact?.contact_acc_name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="contact_acc_name" className="rw-field-error" />

        <Label
          name="contact_uid"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Contact uid
        </Label>

        <TextField
          name="contact_uid"
          defaultValue={props.userPrevContact?.contact_uid}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="contact_uid" className="rw-field-error" />

        <Label
          name="contact_description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Contact description
        </Label>

        <TextField
          name="contact_description"
          defaultValue={props.userPrevContact?.contact_description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="contact_description" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default UserPrevContactForm
