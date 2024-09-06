import type {
  EditTransactionByTransactionId,
  UpdateTransactionInput,
} from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
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

type FormTransaction = NonNullable<
  EditTransactionByTransactionId['transaction']
>

interface TransactionFormProps {
  transaction?: EditTransactionByTransactionId['transaction']
  onSave: (
    data: UpdateTransactionInput,
    transaction_id?: FormTransaction['transaction_id']
  ) => void
  error: RWGqlError
  loading: boolean
}

const TransactionForm = (props: TransactionFormProps) => {
  const onSubmit = (data: FormTransaction) => {
    props.onSave(data, props?.transaction?.transaction_id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormTransaction> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="amount"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Amount
        </Label>

        <NumberField
          name="amount"
          defaultValue={props.transaction?.amount}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="amount" className="rw-field-error" />

        <Label
          name="sender_acc"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Sender acc
        </Label>

        <NumberField
          name="sender_acc"
          defaultValue={props.transaction?.sender_acc}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="sender_acc" className="rw-field-error" />

        <Label
          name="recipient_acc"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Recipient acc
        </Label>

        <NumberField
          name="recipient_acc"
          defaultValue={props.transaction?.recipient_acc}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="recipient_acc" className="rw-field-error" />

        <Label
          name="sender_uid"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Sender uid
        </Label>

        <TextField
          name="sender_uid"
          defaultValue={props.transaction?.sender_uid}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="sender_uid" className="rw-field-error" />

        <Label
          name="recipient_uid"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Recipient uid
        </Label>

        <TextField
          name="recipient_uid"
          defaultValue={props.transaction?.recipient_uid}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="recipient_uid" className="rw-field-error" />

        <Label
          name="recipient_address"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Recipient address
        </Label>

        <TextField
          name="recipient_address"
          defaultValue={props.transaction?.recipient_address}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="recipient_address" className="rw-field-error" />

        <Label
          name="reference"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Reference
        </Label>

        <TextField
          name="reference"
          defaultValue={props.transaction?.reference}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="reference" className="rw-field-error" />

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextField
          name="description"
          defaultValue={props.transaction?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="timestamp"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Timestamp
        </Label>

        <DatetimeLocalField
          name="timestamp"
          defaultValue={formatDatetime(props.transaction?.timestamp)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="timestamp" className="rw-field-error" />

        <Label
          name="recc_transaction_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Recc transaction id
        </Label>

        <NumberField
          name="recc_transaction_id"
          defaultValue={props.transaction?.recc_transaction_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="recc_transaction_id" className="rw-field-error" />

        <Label
          name="settled"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Settled
        </Label>

        <CheckboxField
          name="settled"
          defaultChecked={props.transaction?.settled}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="settled" className="rw-field-error" />

        <Label
          name="type"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Type
        </Label>

        <TextField
          name="type"
          defaultValue={props.transaction?.type}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="type" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default TransactionForm
