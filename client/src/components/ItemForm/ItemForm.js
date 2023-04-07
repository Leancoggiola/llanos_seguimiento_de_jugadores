import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { navigationIcCheck, navigationIcClose } from '../../assets/icons';
import FormField from '../../commonComponents/FormField';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import Label from '../../commonComponents/Label';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
import { Option, Select } from '../../commonComponents/Select';
// Middleware
import { postItemToListRequest, putChangeItemOnListRequest } from '../../middleware/actions/listActions';
// Styling
import './ItemForm.scss';

const ItemForm = (props) => {
    const { onClose, currentApp = '', currentStatus = '', itemData, isNew } = props;
    const [ status, setStatus ] = useState(currentStatus);
    const [ app, setApp ] = useState(currentApp);
    const dispatch = useDispatch();

    const { data: appList} = useSelector((state) => state.meta.appList)
    const { data: statusList} = useSelector((state) => state.meta.statusList)
    const { data: userEmail } = useSelector((state) => state.auth)
    const { loading } = useSelector((state) => state.list.crud);

    const onSubmit = () => {
        const appInfo = appList.find(x => x.name === app)
        const postBody = {
            user: userEmail,
            content: {
                title: itemData.title,
                type: itemData.type,
                imageUrl: itemData.imageUrl,
                appName: appInfo.name,
                appDisplayName: appInfo.displayName,
                status,
                order: statusList.find(x => x.name === status).order
            }
        }
        if (status === 'Terminado') {
            postBody.content['finishedOn'] = new Date();
        }
        isNew ? dispatch(postItemToListRequest(postBody)) : dispatch(putChangeItemOnListRequest(postBody))
        onClose()
    }

    return (
        <>
        {loading ?
            <LoadingSpinner showPosRelative={true} /> : 
            <div className='crud-item'>
                <form className='crud-item-form'>
                    <FormField>
                        <Label>Aplicacion</Label>
                        <Select value={app} onChange={(e) => setApp(e)} required={true} >
                            {appList.map(option => (
                                <Option value={option.name} key={option.name} >
                                    {option.displayName}
                                </Option>
                            ))}
                        </Select>
                    </FormField>
                    <FormField>
                        <Label>Status</Label>
                        <Select value={status} onChange={(e) => setStatus(e)} required={true}>
                            {statusList.map(option => (
                                <Option value={option.name} key={option.name} >
                                    {option.name}
                                </Option>
                            ))}
                        </Select>
                    </FormField>
                </form>
                <div className='crud-item-footer'>
                        <IconButton className='crud-item-footer-btn' onClick={onSubmit} disabled={!app || !status}>
                            <Icon src={navigationIcCheck} />
                        </IconButton>
                        <IconButton className='crud-item-footer-btn' onClick={() => onClose()}>
                            <Icon src={navigationIcClose} />
                        </IconButton>
                </div>
            </div>}
        </>
    )
}

export default ItemForm;