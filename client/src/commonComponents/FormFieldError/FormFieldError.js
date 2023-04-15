import React, { useContext, useEffect } from 'react';
// Components
import Icon from '../Icon';
import { alertIcError } from '../../assets/icons';
import { FormFieldContext } from '../contexts';
// Styling
import './FormFieldError.scss'

const FormFieldError = (props) => {
  const { children, className = '' } = props;
  const formField = useContext(FormFieldContext);

  useEffect(() => {
    formField.setInvalid(true);
    return () => {
      formField.setInvalid(false);
    };
  }, []);

  const classes = `cc-form-field-error ${className ? className : ''}`;

  return (
    <p className={classes} data-motif-error-message>
      <Icon src={alertIcError} className='motif-form-field-error-icon'/>
      {children}
    </p>
  );
};

export default FormFieldError;
