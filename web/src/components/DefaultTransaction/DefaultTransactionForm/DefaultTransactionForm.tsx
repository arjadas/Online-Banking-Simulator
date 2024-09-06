import type {
  EditDefaultTransactionByDefTransactionId,
  UpdateDefaultTransactionInput,
} from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  NumberField,
  CheckboxField,
  Submit,
} from '@redwoodjs/forms'

type FormDefaultTransaction = NonNullable<
  EditDefaultTransactionByDefTransactionId['defaultTransaction']
>

interface DefaultTransactionFormProps {
  defaultTransaction?: EditDefaultTransactionByDefTransactionId['defaultTransaction']
  onSave: (
    data: UpdateDefaultTransactionInput,
    def_transaction_id?: FormDefaultTransaction['def_transaction_id']
  ) => void
  error: RWGqlError
  loading: boolean
}

const DefaultTransactionForm = (props: DefaultTransactionFormProps) => {
  const onSubmit = (data: FormDefaultTransaction) => {
    props.onSave(data, props?.defaultTransaction?.def_transaction_id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormDefaultTransaction> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="sender_uid"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Sender uid
        </Label>

        <TextField
          name="sender_uid"
          defaultValue={props.defaultTransaction?.sender_uid}
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
          defaultValue={props.defaultTransaction?.recipient_uid}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="recipient_uid" className="rw-field-error" />

        <Label
          name="sender_acc"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Sender acc
        </Label>

        <NumberField
          name="sender_acc"
          defaultValue={props.defaultTransaction?.sender_acc}
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
          defaultValue={props.defaultTransaction?.recipient_acc}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="recipient_acc" className="rw-field-error" />

        <Label
          name="incoming"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Incoming
        </Label>

        <CheckboxField
          name="incoming"
          defaultChecked={props.defaultTransaction?.incoming}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="incoming" className="rw-field-error" />

        <Label
          name="amount"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Amount
        </Label>

        <NumberField
          name="amount"
          defaultValue={props.defaultTransaction?.amount}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="amount" className="rw-field-error" />

        <Label
          name="recipient_address"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Recipient address
        </Label>

        <TextField
          name="recipient_address"
          defaultValue={props.defaultTransaction?.recipient_address}
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
          defaultValue={props.defaultTransaction?.reference}
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
          defaultValue={props.defaultTransaction?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="frequency"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Frequency
        </Label>

        <TextField
          name="frequency"
          defaultValue={props.defaultTransaction?.frequency}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="frequency" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default DefaultTransactionForm
