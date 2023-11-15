import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';

import MyEvent from "./panels/MyEvent";

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState();

	useEffect(() => {
		// bridge.send('VKWebAppShowSlidesSheet', {
		// 	slides: [
		// 		{
		// 			media: {
		// 				blob: 'data:image/png;base64,[IMAGE_DATA]',
		// 				type: 'image'
		// 			},
		// 			title: 'Заголовок слайда',
		// 			subtitle: 'Описание слайда под заголовком'
		// 		},
		// 		{
		// 			media: {
		// 				blob: 'data:image/png;base64,[IMAGE_DATA]',
		// 				type: 'image'
		// 			},
		// 			title: 'Заголовок слайда',
		// 			subtitle: 'Описание слайда под заголовком'
		// 		},
		// 	]})
		// 	.then((data) => {
		// 		if (data.result) {
		// 			// Слайды показаны
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		// Ошибка
		// 		console.log(error);
		// 	});
	}, []);
	useEffect(() => {
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			setPopout(null);
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	const handlModalClick = (eventId) => {
	};

	return (
		<ConfigProvider>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout popout={popout}>
						<SplitCol>
							<View activePanel={activePanel}>
								<Home id='home' fetchedUser={fetchedUser} go={go}  />
								<MyEvent id='myevent' go={go} handlModalClick={handlModalClick}/>
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
