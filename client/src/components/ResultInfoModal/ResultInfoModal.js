
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import ErrorMessage from '../../commonComponents/ErrorMessage';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '../../commonComponents/Modal';
import { Pill, PillGroup } from '../../commonComponents/Pill';
import ItemForm from '../ItemForm';
import DeleteConfirmation from '../DeleteConfirmation';
// Middleware
import { getOverviewDetailsRequest } from '../../middleware/actions/searchActions';
// Styling
import './ResultInfoModal.scss';

const ResultInfoModal = (props) => {
    const { show, onClose, item } = props;
    const [ showItemForm, setShowItemForm  ] = useState(false);
    const [ deleteModal, setDeleteModal ] = useState(false);

    const dispatch = useDispatch()
    
    const { loading, data, error } = useSelector((state) => state.search.contentDetails);
    const listCrud = useSelector((state) => state.list.crud);
    

    useEffect(() => {
        if(show) {
            dispatch(getOverviewDetailsRequest(item.id))
        }
    }, [show])

    useEffect(() => {
        if(!isEmpty(listCrud.data)) {
            setShowItemForm(false)
            onClose()
        }
    }, [listCrud.data])


    const getBodyContent = () => {
        if(loading) {
            return <LoadingSpinner showPosRelative={true} />
        }
        if(error) {
            return <ErrorMessage message={'No se encontro el contenido con id'} />
        }
        if(!isEmpty(data)) {
            return (
                <section className='result-overview'>
                    <article className='result-overview-img'>
                        <img src={data.imageUrl} alt={`${item?.title} portrait`} />
                    </article>
                    <article className='result-overview-info'>
                        <section className='result-overview-info-desc'>
                            <article className='result-overview-info-desc-headline'>
                                <h3>{data.type}</h3>
                                <span><b>Valoracion:</b> {data.rating} / 10</span>
                            </article>
                            <article className='result-overview-info-desc-body'>
                                <h4>Resumen:</h4>
                                <p>{data.summary}</p>
                                <span><i>Fecha de estreno: {data.releaseYear}</i></span>
                            </article>
                            <article>
                                <PillGroup >
                                    {data.genres.map((genre, index) => {
                                        return <Pill key={genre+index} variant='monochrome'>{genre}</Pill>
                                    })}
                                </PillGroup>
                            </article>
                        </section>
                    </article>
                </section>
            )
        }
    }

    const getFooterContent = () => { 
        if(showItemForm) {
            return <ItemForm onClose={() => setShowItemForm(false)} itemData={data} isNew={true}/>
        }
        if(!item?.inList) {
            return (
                <button type='button' className='overview-footer-btn btn-primary btn' onClick={() => setShowItemForm(true)}>
                    Añadir a la lista
                </button>
            )
        } else {
            return (
                <button type='button' className='overview-footer-btn-remove overview-footer-btn btn' onClick={() => setDeleteModal(true)}>
                    Eliminar a la lista
                </button>   
            )
        }
    }
    
    return (
        <Modal show={show} onClose={onClose}>
            <ModalHeader>{item?.title}</ModalHeader>
            <ModalBody>
                {getBodyContent()}
            </ModalBody>
            {!isEmpty(data) && (
            <ModalFooter className={'overview-footer'}>
                {getFooterContent()}
            </ModalFooter>)}
            {deleteModal && <DeleteConfirmation show={deleteModal} 
                onClose={() => setDeleteModal(false)} 
                onSubmit={() => setDeleteModal(false)} 
                title={item?.title}
            />}
        </Modal>
    )
}

export default ResultInfoModal;