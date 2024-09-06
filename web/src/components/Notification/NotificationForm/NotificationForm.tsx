import type {
  EditNotificationByNotificationId,
  UpdateNotificationInput,
} from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  CheckboxField,
  Submit,
} from '@redwoodjs/forms'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

type FormNotification = NonNullable<
  EditNotificationByNotificationId['notification']
>

interface NotificationFormProps {
  notification?: EditNotificationByNotificationId['notification']
  onSave: (
    data: UpdateNotificationInput,
    notification_id?: FormNotification['notification_id']
  ) => void
  error: RWGqlError
  loading: boolean
}

const NotificationForm = (props: NotificationFormProps) => {
  const onSubmit = (data: FormNotification) => {
    props.onSave(data, props?.notification?.notification_id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormNotification> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="uid"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Uid
        </Label>

        <TextField
          name="uid"
          defaultValue={props.notification?.uid}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="uid" className="rw-field-error" />

        <Label
          name="timestamp"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Timestamp
        </Label>

        <DatetimeLocalField
          name="timestamp"
          defaultValue={formatDatetime(props.notification?.timestamp)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="timestamp" className="rw-field-error" />

        <Label
          name="type"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Type
        </Label>

        <TextField
          name="type"
          defaultValue={props.notification?.type}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="type" className="rw-field-error" />

        <Label
          name="content"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Content
        </Label>

        <TextField
          name="content"
          defaultValue={props.notification?.content}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="content" className="rw-field-error" />

        <Label
          name="read"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Read
        </Label>

        <CheckboxField
          name="read"
          defaultChecked={props.notification?.read}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="read" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default NotificationForm
