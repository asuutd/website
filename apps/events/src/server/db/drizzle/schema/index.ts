import * as account from './account';
import * as code from './code';
import * as event from './event';
import * as eventAdmin from './eventadmin';
import * as eventLocation from './eventlocation';
import * as example from './example';
import * as organizer from './organizer';
import * as refCode from './refcode';
import * as session from './session';
import * as ticket from './ticket';
import * as tier from './tier';
import * as user from './user';
import * as verificationToken from './vertificationtoken';

const schema = {
	...account,
	...code,
	...event,
	...eventAdmin,
	...eventLocation,
	...example,
	...organizer,
	...refCode,
	...session,
	...ticket,
	...tier,
	...user,
	...verificationToken
};

export default schema;
