import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, Text, View, TextInput } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import Avatar from '../../containers/Avatar';
import Status from '../../containers/status';
import Touch from '../../utils/touch';
import RocketChat from '../../lib/rocketchat';

@connect(state => ({
	user: state.login.user,
	baseUrl: state.settings.Site_Url || state.server ? state.server.server : ''
}))
export default class MentionedMessagesView extends React.PureComponent {
	static propTypes = {
		navigation: PropTypes.object
	}

	static navigationOptions = ({ navigation }) => {
		const params = navigation.state.params || {};
		const label = params.allUsers ? 'All' : 'Online';
		if (params.allUsers === undefined) {
			return;
		}
		return {
			headerRight: (
				<Touch
					onPress={params.onPressToogleStatus}
					underlayColor='#ffffff'
					activeOpacity={0.5}
					accessibilityLabel={label}
					accessibilityTraits='button'
					style={styles.headerButtonTouchable}
				>
					<View style={styles.headerButton}>
						<Text style={styles.headerButtonText}>{label}</Text>
					</View>
				</Touch>
			)
		};
	};

	constructor(props) {
		super(props);
		const { rid, members } = props.navigation.state.params;
		this.state = {
			allUsers: false,
			filtering: false,
			rid,
			members,
			membersFiltered: []
		};
	}

	componentWillMount() {
		this.props.navigation.setParams({
			onPressToogleStatus: this._onPressToogleStatus,
			allUsers: this.state.allUsers
		});
	}

	onSearchChangeText = (text) => {
		let membersFiltered = [];
		if (text) {
			membersFiltered = this.state.members.filter(m => m.username.toLowerCase().match(text.toLowerCase()));
		}
		this.setState({ filtering: !!text, membersFiltered });
	}

	_onPressToogleStatus = async() => {
		const allUsers = !this.state.allUsers;
		this.props.navigation.setParams({ allUsers });
		const membersResult = await RocketChat.getRoomMembers(this.state.rid, allUsers);
		const members = membersResult.records;
		this.setState({ allUsers, members });
	}

	renderSearchBar = () => (
		<View style={styles.searchBoxView}>
			<TextInput
				underlineColorAndroid='transparent'
				style={styles.searchBox}
				onChangeText={text => this.onSearchChangeText(text)}
				returnKeyType='search'
				placeholder='Search'
				clearButtonMode='while-editing'
				blurOnSubmit
			/>
		</View>
	)

	renderSeparator = () => <View style={styles.separator} />;

	renderItem = ({ item }) => (
		<View style={styles.item}>
			<Avatar text={item.username} size={30} type='d' style={styles.avatar}>{<Status style={styles.status} id={item._id} />}</Avatar>
			<Text style={styles.username}>{item.username}</Text>
		</View>
	)

	render() {
		const { filtering, members, membersFiltered } = this.state;
		return (
			<FlatList
				key='room-members-view-list'
				data={filtering ? membersFiltered : members}
				renderItem={this.renderItem}
				style={styles.list}
				keyExtractor={item => item._id}
				ItemSeparatorComponent={this.renderSeparator}
				ListHeaderComponent={this.renderSearchBar}
			/>
		);
	}
}
