import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import {
    Panel,
    PanelHeader,
    Header,
    Button,
    Group,
    Cell,
    Div,
    Avatar,
    FixedLayout,
    SplitLayout,
    Input,
    FormItem,
    View,
    PanelHeaderBack,
    FormLayout,
    Textarea,
    Snackbar,
    PanelHeaderButton,
    ModalRoot,
    ModalPage,
    ModalPageHeader, Epic, Tabbar, TabbarItem, PanelHeaderClose
} from '@vkontakte/vkui';
import {
    Icon28CalendarOutline,
    Icon28CancelCircleFillRed,
    Icon28CheckCircleOutline,
    Icon28FavoriteOutline, Icon28UserCircleOutline
} from "@vkontakte/icons";
import bridge from "@vkontakte/vk-bridge";

const Home = ({id, go, fetchedUser}) => {
    const [snackbar, setSnackbar] = useState(null);
    const [formValid, setFormValid] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [description, setDescription] = useState('');
    const [pointValue, setPointValue] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState('');

    const [nameError, setNameError] = useState('');
    const [dateError, setDateError] = useState('');
    const [startTimeError, setStartTimeError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [pointValueError, setPointValueError] = useState('');
    const [locationError, setLocationError] = useState('');
    const [imageError, setImageError] = useState('');
    const [user, setUser] = useState(null);


    useEffect(() => {
        // ... Ваш код с проверками на валидность полей
        // Не забудьте провести валидацию всех полей, как в вашем предыдущем коде
        const isNameValid = name.trim() !== '';
        const isDateValid = date.trim() !== '';
        const isStartTimeValid = startTime.trim() !== '';
        const isDescriptionValid = description.trim() !== '';
        //const isPointValueValid = !isNaN(pointValue);
        const isLocationValid = location.trim() !== '';
        //const isImageValid = image.trim() !== '';

        const isImageValid = isValidImageUrl(image);
        const isPointValueValid = isValidPositiveInteger(pointValue);

        setFormValid(
            isNameValid &&
            isDateValid &&
            isStartTimeValid &&
            isDescriptionValid &&
            isPointValueValid &&
            isLocationValid &&
            isImageValid
        );

        // Обновляем сообщения об ошибках
        if (buttonClicked) {
            setNameError(isNameValid ? '' : 'Заполните это поле');
            setDateError(isDateValid ? '' : 'Заполните это поле');
            setStartTimeError(isStartTimeValid ? '' : 'Заполните это поле');
            setDescriptionError(isDescriptionValid ? '' : 'Заполните это поле');
            //setPointValueError(isPointValueValid ? '' : 'Введите положительное числовое значение');
            setPointValueError(isPointValueValid ? '' : 'Введите положительное числовое значение');
            setLocationError(isLocationValid ? '' : 'Заполните это поле');
            //setImageError(isImageValid ? '' : 'Заполните это поле');
            setImageError(isImageValid ? '' : 'Введите корректный URL изображения');
        }
    }, [name, date, startTime, description, pointValue, location, image, buttonClicked]);

    const fetchData = async () => {
        try {
            const user = await bridge.send('VKWebAppGetUserInfo');
            console.log('Информация о пользователе:', user);
            setUser(user);
        } catch (error) {
            console.error('Ошибка при получении информации о пользователе:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const isValidImageUrl = (url) => {
        //const urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        const urlPattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        return urlPattern.test(url);
      };
      
      const isValidPositiveInteger = (value) => {
        const intValue = parseInt(value, 10);
        return !isNaN(intValue) && intValue > 0;
      };


    const handleSend = async (name, date, startTime, description, pointValue, location, image, adminVkId) => {
        if (!formValid) {
            // Логика для обработки невалидных данных формы
            console.error('Невалидные данные формы');
            setButtonClicked(true);
            setSnackbar(
                <Snackbar
                    onClose={() => {
                        setSnackbar(null);
                    }}
                    before={<Icon28CancelCircleFillRed/>}
                >
                    Пожалуйста, заполните все поля корректно!
                </Snackbar>
            );
            return;
        }

        try {
            const eventData = {
                adminVkId: user.id,
                name,
                date,
                startTime,
                description,
                pointValue: Number(pointValue), // преобразование в число
                location,
                image
            };

            console.log('Данные для отправки на сервер:', eventData);
            const url = "https://persikivk.ru/api/event/create";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });

            if (response.ok) {
                // Обработка успешного ответа от сервера
                console.log('Данные успешно отправлены на сервер. Ответ сервера:', await response.json());

                setSnackbar(
                    <Snackbar
                        onClose={() => {
                            setSnackbar(null);
                            go({currentTarget: {dataset: {to: 'myevent'}}});
                        }}
                        before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)"/>}
                    >
                        Мероприятие успешно создано!
                    </Snackbar>
                );

            } else {
                // Обработка ошибки
                console.error('Ошибка при отправке данных на сервер');
            }
        } catch (error) {
            console.error('Ошибка при отправке данных на сервер:', error);
            console.error('Статус ошибки:', error.status);
            console.error('Текст ошибки:', error.statusText);
        }
    };

    return (
        <Epic activeStory={id}>
            <View id={id} activePanel={id}>
                <Panel id={id}>
                    <PanelHeader>Создание мероприятия</PanelHeader>
                    <FormLayout style={{marginBottom: '30px'}}>
                        <FormItem top="Название" htmlFor="name"
                                  bottom={<span style={{color: 'red'}}>{nameError}</span>}>
                            <Input
                                type="text"
                                placeholder="Введите название"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </FormItem>
                        <FormItem top="Дата" htmlFor="date" bottom={<span style={{color: 'red'}}>{dateError}</span>}>
                            <Input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </FormItem>
                        <FormItem top="Время начала" htmlFor="startTime"
                                  bottom={<span style={{color: 'red'}}>{startTimeError}</span>}>
                            <Input
                                type="time"
                                value={startTime}
                                onChange={e => setStartTime(e.target.value)}
                            />
                        </FormItem>
                        <FormItem top="Описание" htmlFor="description"
                                  bottom={<span style={{color: 'red'}}>{descriptionError}</span>}>
                            <Textarea
                                placeholder="Введите описание"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </FormItem>
                        <FormItem top="Баллы" htmlFor="pointValue"
                                  bottom={<span style={{color: 'red'}}>{pointValueError}</span>}>
                            <Input
                                type="number"
                                placeholder="Введите баллы"
                                value={pointValue}
                                onChange={e => setPointValue(e.target.value)}
                            />
                        </FormItem>
                        <FormItem top="Местоположение" htmlFor="location"
                                  bottom={<span style={{color: 'red'}}>{locationError}</span>}>
                            <Input
                                type="text"
                                placeholder="Введите местоположение"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                            />
                        </FormItem>
                        <FormItem top="Ссылка на изображение" htmlFor="image"
                                  bottom={<span style={{ color: 'red' }}>{imageError}</span>}>
                            <Input
                                type="text"
                                placeholder="Введите URL изображения"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                        </FormItem>

                        <Div>
                            <Button
                                size="l"
                                stretched
                                onClick={() => handleSend(name, date, startTime, description, pointValue, location, image)}
                                style={{backgroundColor: '#4CD964'}} // Обратите внимание на свойство backgroundColor
                            >
                                Создать мероприятие
                            </Button>

                        </Div>

                        {snackbar}

                    </FormLayout>

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


Home.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
};

export default Home;
