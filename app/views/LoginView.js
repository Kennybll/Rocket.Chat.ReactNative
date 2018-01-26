import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import PropTypes from 'prop-types';
import { Keyboard, Text, TextInput, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { loginSubmit } from '../actions/login';
import KeyboardView from '../presentation/KeyboardView';

import styles from './Styles';
import scrollPersistTaps from '../utils/scrollPersistTaps';
import { showToast } from '../utils/info';

@connect(state => ({
	server: state.server.server,
	Accounts_EmailOrUsernamePlaceholder: state.settings.Accounts_EmailOrUsernamePlaceholder,
	Accounts_PasswordPlaceholder: state.settings.Accounts_PasswordPlaceholder,
	login: state.login
}), dispatch => ({
	loginSubmit: params => dispatch(loginSubmit(params))
}))
export default class LoginView extends React.Component {
	static propTypes = {
		loginSubmit: PropTypes.func.isRequired,
		Accounts_EmailOrUsernamePlaceholder: PropTypes.string,
		Accounts_PasswordPlaceholder: PropTypes.string,
		login: PropTypes.object,
		navigation: PropTypes.object.isRequired
	}

	static navigationOptions = () => ({
		title: 'Login'
	});

	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: ''
		};
	}

	submit = () => {
		const {	username, password, code } = this.state;
		if (username.trim() === '' || password.trim() === '') {
			showToast('Email or password field is empty');
			return;
		}

		this.props.loginSubmit({	username, password, code });
		Keyboard.dismiss();
	}

	register = () => {
		this.props.navigation.navigate('Register');
	}

	termsService = () => {
		this.props.navigation.navigate('TermsService');
	}

	privacyPolicy = () => {
		this.props.navigation.navigate('PrivacyPolicy');
	}

	forgotPassword = () => {
		this.props.navigation.navigate('ForgotPassword');
	}

	renderTOTP = () => {
		if (/totp/ig.test(this.props.login.error.error)) {
			return (
				<TextInput
					ref={ref => this.codeInput = ref}
					style={styles.input_white}
					onChangeText={code => this.setState({ code })}
					keyboardType='numeric'
					autoCorrect={false}
					returnKeyType='done'
					autoCapitalize='none'
					onSubmitEditing={this.submit}
					placeholder='Code'
					underlineColorAndroid='transparent'
				/>
			);
		}
		return null;
	}

	render() {
		return (
			<KeyboardView
				contentContainerStyle={styles.container}
				keyboardVerticalOffset={128}
			>
				<ScrollView
					style={styles.loginView}
					{...scrollPersistTaps}
				>
					<SafeAreaView>
						<View style={styles.formContainer}>
							<TextInput
								style={styles.input_white}
								onChangeText={username => this.setState({ username })}
								keyboardType='email-address'
								autoCorrect={false}
								returnKeyType='next'
								autoCapitalize='none'
								underlineColorAndroid='transparent'
								onSubmitEditing={() => { this.password.focus(); }}
								placeholder={this.props.Accounts_EmailOrUsernamePlaceholder || 'Email or username'}
							/>
							<TextInput
								ref={(e) => { this.password = e; }}
								style={styles.input_white}
								onChangeText={password => this.setState({ password })}
								secureTextEntry
								autoCorrect={false}
								returnKeyType='done'
								autoCapitalize='none'
								underlineColorAndroid='transparent'
								onSubmitEditing={this.submit}
								placeholder={this.props.Accounts_PasswordPlaceholder || 'Password'}
							/>

							{this.renderTOTP()}

							<TouchableOpacity
								style={styles.buttonContainer}
								onPress={this.submit}
							>
								<Text style={styles.button} accessibilityTraits='button'>LOGIN</Text>
							</TouchableOpacity>

							<View style={styles.loginSecondaryButtons}>
								<TouchableOpacity style={styles.buttonContainer_inverted} onPress={this.register}>
									<Text style={styles.button_inverted} accessibilityTraits='button'>REGISTER</Text>
								</TouchableOpacity>

								<TouchableOpacity style={styles.buttonContainer_inverted} onPress={this.forgotPassword}>
									<Text style={styles.button_inverted} accessibilityTraits='button'>FORGOT MY PASSWORD</Text>
								</TouchableOpacity>
							</View>

							<View style={[styles.loginSecondaryButtons, { justifyContent: 'center' }]}>
								<TouchableOpacity style={[styles.oauthButton, { backgroundColor: '#3b5998' }]}>
									<Icon name='facebook' size={20} color='#ffffff' />
								</TouchableOpacity>
								<TouchableOpacity style={[styles.oauthButton, { backgroundColor: '#4c4c4c' }]}>
									<Icon name='github' size={20} color='#ffffff' />
								</TouchableOpacity>
								<TouchableOpacity style={[styles.oauthButton, { backgroundColor: '#373d47' }]}>
									<Icon name='gitlab' size={20} color='#ffffff' />
								</TouchableOpacity>
								<TouchableOpacity style={[styles.oauthButton, { backgroundColor: '#dd4b39' }]}>
									<Icon name='google' size={20} color='#ffffff' />
								</TouchableOpacity>
								<TouchableOpacity style={[styles.oauthButton, { backgroundColor: '#1b86bc' }]}>
									<Icon name='linkedin' size={20} color='#ffffff' />
								</TouchableOpacity>
								<TouchableOpacity style={[styles.oauthButton, { backgroundColor: '#de4f4f' }]}>
									<MaterialCommunityIcons name='meteor' size={25} color='#ffffff' />
								</TouchableOpacity>
								<TouchableOpacity style={[styles.oauthButton, { backgroundColor: '#02acec' }]}>
									<Icon name='twitter' size={20} color='#ffffff' />
								</TouchableOpacity>
							</View>

							<TouchableOpacity>
								<Text style={styles.loginTermsText} accessibilityTraits='button'>
									By proceeding you are agreeing to our
									<Text style={styles.link} onPress={this.termsService}> Terms of Service </Text>
									and
									<Text style={styles.link} onPress={this.privacyPolicy}> Privacy Policy</Text>
								</Text>
							</TouchableOpacity>
							{this.props.login.failure && <Text style={styles.error}>{this.props.login.error.reason}</Text>}
						</View>
						<Spinner visible={this.props.login.isFetching} textContent='Loading...' textStyle={{ color: '#FFF' }} />
					</SafeAreaView>
				</ScrollView>
			</KeyboardView>
		);
	}
}
