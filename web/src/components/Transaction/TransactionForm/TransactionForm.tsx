import type { EditTransactionById, UpdateTransactionInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  Submit,
} from '@redwoodjs/forms'

type FormTransaction = NonNullable<EditTransactionById['transaction']>

interface TransactionFormProps {
  transaction?: EditTransactionById['transaction']
  onSave: (data: UpdateTransactionInput, id?: FormTransaction['id']) => void
  error: RWGqlError
  loading: boolean
}

const TransactionForm = (props: TransactionFormProps) => {
  const onSubmit = (data: FormTransaction) => {
    props.onSave(data, props?.transaction?.id)
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
