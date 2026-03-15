import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // ייבוא קובץ ה-CSS של notyf

class Notify {
  constructor() {
    this.notyf = new Notyf({
      duration: 3000,
      position: { x: 'center', y: 'top' }, // מיקום ההודעה במרכז למעלה
      dismissible: true,
    });
  }

  success(message) {
    this.notyf.success(message);
  }

  error(err) {
    const message = this.extractErrorMessage(err);
    this.notyf.error(message);
  }

  extractErrorMessage(err) {
    if (typeof err === 'string') {
      return err;
    }
    if (typeof err.response?.data === 'string') {
      return err.response.data;
    }
    if (typeof err.message === 'string') {
      return err.message;
    }
    return 'Some error, please try again';
  }
}

const notify = new Notify();

export default notify;