import type { EditAccountByAcc, UpdateAccountInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  NumberField,
  DatetimeLocalField,
  Submit,
} from '@redwoodjs/forms'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

type FormAccount = NonNullable<EditAccountByAcc['account']>

interface AccountFormProps {
  account?: EditAccountByAcc['account']
  onSave: (data: UpdateAccountInput, acc?: FormAccount['acc']) => void
  error: RWGqlError
  loading: boolean
}

const AccountForm = (props: AccountFormProps) => {
  const onSubmit = (data: FormAccount) => {
    props.onSave(data, props?.account?.acc)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormAccount> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="acc_name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Acc name
        </Label>

        <TextField
          name="acc_name"
          defaultValue={props.account?.acc_name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="acc_name" className="rw-field-error" />

        <Label
          name="uid"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Uid
        </Label>

        <TextField
          name="uid"
          defaultValue={props.account?.uid}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="uid" className="rw-field-error" />

        <Label
          name="pay_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Pay id
        </Label>

        <TextField
          name="pay_id"
          defaultValue={props.account?.pay_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="pay_id" className="rw-field-error" />

        <Label
          name="biller_code"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Biller code
        </Label>

        <NumberField
          name="biller_code"
          defaultValue={props.account?.biller_code}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="biller_code" className="rw-field-error" />

        <Label
          name="crn"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Crn
        </Label>

        <NumberField
          name="crn"
          defaultValue={props.account?.crn}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="crn" className="rw-field-error" />

        <Label
          name="short_description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Short description
        </Label>

        <TextField
          name="short_description"
          defaultValue={props.account?.short_description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="short_description" className="rw-field-error" />

        <Label
          name="long_description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Long description
        </Label>

        <TextField
          name="long_description"
          defaultValue={props.account?.long_description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="long_description" className="rw-field-error" />

        <Label
          name="opened_timestamp"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Opened timestamp
        </Label>

        <DatetimeLocalField
          name="opened_timestamp"
          defaultValue={formatDatetime(props.account?.opened_timestamp)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="opened_timestamp" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default AccountForm
