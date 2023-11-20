import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {
    CardGrid,
    ContentCard,
    Div,
    Epic,
    Group,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Tabbar,
    TabbarItem,
    View,
    Text,
    Title, PanelHeaderButton, ModalPageHeader, ModalPage, ModalRoot, PanelHeaderClose, Button, SplitLayout
} from '@vkontakte/vkui';

import sadPersik from '../img/newSadPersik.png';
import bridge from "@vkontakte/vk-bridge";
import vkQr from '@vkontakte/vk-qr';
import {Icon28CalendarOutline, Icon28FavoriteOutline, Icon20DonateOutline, Icon24ShareOutline} from "@vkontakte/icons";



const MyEvent = ({id, go}) => {
    const [user, setUser] = useState({});
    const [userEvents, setUserEvents] = useState([]);

    const [events, setEvents] = useState([]);
    const [modal, setModal] = useState(null); // Состояние модального окна


    const openModals = (event) => {
        // Генерируем QR-код с использованием данных о мероприятии
        const qrCodeSvg = vkQr.createQR(`${event.pointValue}`, {
            qrSize: 256,
            isShowLogo: true,
            // Добавьте другие параметры в соответствии с вашими требованиями
        });
        // Добавьте отладочные выводы в консоль для проверки значений
        console.log('event.name:', event.name);
        console.log('event.date:', event.date);
        // const qrCodeSvg = (
        // 	<QRCode
        // 		value={`${event.pointValue}`}
        // 		size={256}
        // 		renderAs="svg"
        // 	/>
        // );

        if (!qrCodeSvg) {
            console.error('QR code SVG is null or undefined');
            return;
        }

        setModal(
            <ModalRoot
                onClose={() => setModal(null)}
                activeModal="qrModal"
            >
                <ModalPage
                    id="qrModal"
                    onClose={() => setModal(null)}
                    header={
                        <ModalPageHeader
                            left={<PanelHeaderClose onClick={() => setModal(null)}/>}
                        >
                            Ваш QR-код
                        </ModalPageHeader>
                    }
                >
                    <Group style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                        <Div style={{marginBottom: '10px', paddingBottom: '30px'}} dangerouslySetInnerHTML={{__html: qrCodeSvg}}/>
                            <Title level="1" weight="bold" style={{marginBottom: '10px', fontSize: '16px', whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>{`Мероприятие: ${event.name}`}</Title>
                    </Group>
                </ModalPage>
            </ModalRoot>
        );
    };


    // Асинхронная функция для получения мероприятий
    const fetchEvents = async () => {
        try {

            const user = await bridge.send('VKWebAppGetUserInfo');
            setUser(user);
            const userId = user.id;
            // Отправляем GET-запрос к бекенду
            const response = await fetch('https://persikivk.ru/api/event/');

            // Проверяем, успешен ли запрос (статус 200)
            if (response.ok) {
                // Получаем данные в формате JSON
                const data = await response.json();
                console.log('Данные с сервера:', data); // Выводим данные в консоль
                // Обновляем состояние компонента с полученными данными

                // Фильтруем мероприятия: оставляем только те, где adminVkId === user.id
                const userEvents = data.filter(event => event.adminVkId === userId);
                setEvents(userEvents);


                // Проверяем adminVkId каждого мероприятия
                data.forEach(event => {
                    if (event.adminVkId === user.id) {
                        console.log(`Пользователь ${user.id} является администратором мероприятия ${event.name}`);
                    }
                });
            } else {
                // Если запрос не успешен, выводим ошибку
                console.error('Ошибка при получении мероприятий');
            }
        } catch (error) {
            // Если возникла ошибка при выполнении запроса
            console.error('Ошибка:', error);
        }
    };

    // Используем useEffect для вызова функции fetchEvents при загрузке компонента
    useEffect(() => {
        fetchEvents();
    }, []);


    return (
        <Epic activeStory={id}>
            <View id={id} activePanel={id}>
                <Panel id={id}>
                    <PanelHeader style={{textAlign: 'center'}}>Созданные мной мероприятия
                    </PanelHeader>
                    <Group style={{marginBottom: '30px', paddingBottom: '30px'}}>
                        {events.length === 0 ? (
                            <Div style={{textAlign: 'center'}}>
                                <img
                                    src={sadPersik}
                                    alt="Грустный персик"
                                    style={{marginTop: '30px'}}
                                />
                                <Title level="2" weight="demibold">Мероприятия не найдены</Title>
                                <Text weight="regular" style={{marginTop: '15px'}}>У вас пока нет выбранных
                                    мероприятий.</Text>
                                <Text weight="regular">Переходите в Мероприятия и участвуйте!</Text>
                            </Div>
                        ) : (
                            events.map(event => (
                                <Div key={event.id} onClick={() => openModals(event)}>
                                    <ContentCard
                                        style={{width: '100%', objectFit: 'cover', height: '350'}}
                                        maxHeight={350}
                                        header={event.name}


                                        caption={
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <div>
                                                    <Text>{`Дата:  ${event.date}`}</Text>
                                                </div>
                                                <Div style={{paddingTop: '5px'}}>
                                                    <Icon24ShareOutline/>
                                                </Div>
                                            </div>
                                        }
                                    />
                                </Div>
                            ))
                        )}
                    </Group>
                    <SplitLayout modal={modal}></SplitLayout>
                    <Tabbar style={{position: 'fixed', bottom: 0, width: '100%'}}>
                        <TabbarItem
                            onClick={go}
                            data-to="home"
                            selected={id === 'home'}
                            text="Создание">
                            <Icon28CalendarOutline/>
                        </TabbarItem>
                        <TabbarItem
                            onClick={go}
                            data-to="myevent"
                            selected={id === 'myevent'}
                            text="Созданные мной">
                            <Icon28FavoriteOutline/>
                        </TabbarItem>
                    </Tabbar>
                </Panel>
            </View>
        </Epic>
    );

}


MyEvent.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
};

export default MyEvent;
