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
	ModalPageHeader
} from '@vkontakte/vkui';
import {Icon28CancelCircleFillRed, Icon28CheckCircleOutline} from "@vkontakte/icons";

const Home = ({ id, go, fetchedUser }) => {
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

	const [pointsToSend, setPointsToSend] = useState(0); // Стейт для количества баллов для отправки
	const [qrData, setQRData] = useState(''); // Стейт для данных QR-кода
	const [modal, setModal] = useState(null); // Стейт для модального окна

	useEffect(() => {
		// ... Ваш код с проверками на валидность полей
		// Не забудьте провести валидацию всех полей, как в вашем предыдущем коде
		const isNameValid = name.trim() !== '';
		const isDateValid = date.trim() !== '';
		const isStartTimeValid = startTime.trim() !== '';
		const isDescriptionValid = description.trim() !== '';
		const isPointValueValid = !isNaN(pointValue);
		const isLocationValid = location.trim() !== '';
		const isImageValid = image.trim() !== '';

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
			setPointValueError(isPointValueValid ? '' : 'Введите числовое значение');
			setLocationError(isLocationValid ? '' : 'Заполните это поле');
			setImageError(isImageValid ? '' : 'Заполните это поле');
		}
	}, [name, date, startTime, description, pointValue, location, image, buttonClicked]);

	const handleSend = async (name, date, startTime, description, pointValue, location, image) => {
		if (!formValid) {
			// Логика для обработки невалидных данных формы
			console.error('Невалидные данные формы');
			setButtonClicked(true);
			setSnackbar(
				<Snackbar
					onClose={() => {
						setSnackbar(null);
					}}
					before={<Icon28CancelCircleFillRed />}
				>
					Пожалуйста, заполните все поля!
				</Snackbar>
			);
			return;
		}

		try {
			const eventData = {
				name,
				date,
				startTime,
				description,
				pointValue,
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

				setPointsToSend(pointValue); // Установка количества баллов
				setQRData(`Название: ${name}\nДата: ${date}\nВремя: ${startTime}\nБаллы: ${pointValue}`);

				setSnackbar(
					<Snackbar
						onClose={() => {
							setSnackbar(null);
							go({ currentTarget: { dataset: { to: 'myevent' } } });
						}}
						before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
					>
						Мероприятие успешно создано!
					</Snackbar>
				);

				// Открытие модального окна с информацией о количестве баллов
				setModal(
					<ModalRoot activeModal="pointsModal">
						<ModalPage
							id="pointsModal"
							onClose={() => setModal(null)}
							header={
								<ModalPageHeader
									left={<PanelHeaderButton onClick={() => setModal(null)}>Закрыть</PanelHeaderButton>}
								>
									Количество баллов
								</ModalPageHeader>
							}
						>
							<div style={{ padding: '20px', textAlign: 'center' }}>
								<h2>Поздравляем!</h2>
								<p>Вы заработали {pointsToSend} баллов!</p>
							</div>
						</ModalPage>
					</ModalRoot>
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
		<View id={id} activePanel={id}>
			<Panel id={id}>
				<PanelHeader>Создание мероприятия</PanelHeader>
				<FormLayout style={{marginBottom: '30px'}}>
					<FormItem top="Название" htmlFor="name" bottom={<span style={{ color: 'red' }}>{nameError}</span>}>
						<Input
							type="text"
							placeholder="Введите название"
							value={name}
							onChange={e => setName(e.target.value)}
						/>
					</FormItem>
					<FormItem top="Дата" htmlFor="date" bottom={<span style={{ color: 'red' }}>{dateError}</span>}>
						<Input
							type="date"
							value={date}
							onChange={e => setDate(e.target.value)}
						/>
					</FormItem>
					<FormItem top="Время начала" htmlFor="startTime" bottom={<span style={{ color: 'red' }}>{startTimeError}</span>}>
						<Input
							type="time"
							value={startTime}
							onChange={e => setStartTime(e.target.value)}
						/>
					</FormItem>
					<FormItem top="Описание" htmlFor="description" bottom={<span style={{ color: 'red' }}>{descriptionError}</span>}>
						<Textarea
							placeholder="Введите описание"
							value={description}
							onChange={e => setDescription(e.target.value)}
						/>
					</FormItem>
					<FormItem top="Баллы" htmlFor="pointValue" bottom={<span style={{ color: 'red' }}>{pointValueError}</span>}>
						<Input
							type="number"
							placeholder="Введите баллы"
							value={pointValue}
							onChange={e => setPointValue(e.target.value)}
						/>
					</FormItem>
					<FormItem top="Местоположение" htmlFor="location" bottom={<span style={{ color: 'red' }}>{locationError}</span>}>
						<Input
							type="text"
							placeholder="Введите местоположение"
							value={location}
							onChange={e => setLocation(e.target.value)}
						/>
					</FormItem>
					<FormItem top="Ссылка на изображение" htmlFor="image" bottom={<span style={{ color: 'red' }}>{imageError}</span>}>
						<Input
							type="text"
							placeholder="Введите URL изображения"
							value={image}
							onChange={e => setImage(e.target.value)}
						/>
					</FormItem>

					<Button
						size="l"
						stretched
						onClick={() => handleSend(name, date, startTime, description, pointValue, location, image)}
						style={{ background: '#4CD964' }}
					>
						Создать мероприятие
					</Button>
					{snackbar}
				</FormLayout>
			</Panel>
		</View>
	);

}


Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Home;
