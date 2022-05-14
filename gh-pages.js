import { publish } from 'gh-pages';

publish(
	'build', // path to public directory
	{
		branch: 'gh-pages',
		repo: 'https://github.com/kangruixiang/color-picker.git', // Update to point to your repository
		user: {
			name: 'Kang Rui Xiang', // update to use your name
			email: 'kangruixiang@gmail.com' // Update to use your email
		},
		dotfiles: true
	},
	() => {
		console.log('Deploy Complete!');
	}
);
