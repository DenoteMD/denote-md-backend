import { EventEmitter } from 'events';
import Singleton from './singleton';

export const FrameworkEvent = Singleton('fw-event', EventEmitter);

export default FrameworkEvent;
