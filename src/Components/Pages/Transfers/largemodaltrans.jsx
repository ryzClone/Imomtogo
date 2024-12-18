import React, { useEffect, useState, useRef } from 'react';
import '../../style/largemodal.css';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import Referense from '../Referense';

const handleInputChange = (e, setJsonData) => {
  const { name, value } = e.target;

  setJsonData(prev => {
    const newJsonData = { ...prev, [name]: value };

    if (name === 'employee_fio') {
      const formattedFio = value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      newJsonData.employee_fio = formattedFio;

      const fioParts = formattedFio.split(' ');
      if (fioParts.length >= 2) {
        const shortFio = fioParts.length === 3 || fioParts.length === 4
          ? `${fioParts[0]}.${fioParts[1][0]}.${fioParts[2][0]}`
          : `${fioParts[0]}.${fioParts[1][0]}`;
        newJsonData.new_employee_fio = shortFio;
      } else {
        newJsonData.new_employee_fio = '';
      }
    }

    return newJsonData;
  });

};

const SendModal = ({ show, onClose, data = {} }) => {
  const [inputsDisabled, setInputsDisabled] = useState(false);
  const [jsonData, setJsonData] = useState({
    employee_podrazdelenie: data.подразделение,
    order_name: data.отдел,
    employee_fio: data.фио,
    employee_seria: data.серийный_номер,
    employee_date: data.data_vydachi ,
    employee_viden: data.кем_выдан,
    naimenovaniya_tex: data.наименование_техники || '',
    inv_tex: data.инвентарный_номер_техники || '',
    new_employee_fio: data.фио,
    position: data.должность,
    macadress: data.мак_адресс,
  });  
  

  const [pdfUrl, setPdfUrl] = useState('');
  const [pdffile, setPdffile] = useState('new_output.pdf');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPdfUpdated, setIsPdfUpdated] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const fileInputRef = useRef(null);

  const BACK_API = process.env.REACT_APP_BACK_API;


  const navigate = useNavigate();

  // Message Modal
  const [text, setText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPdfUrl(pdffile);
  }, [pdffile]);

  useEffect(() => {
    const requiredFields = [
      jsonData.employee_podrazdelenie,
      jsonData.order_name,
      jsonData.employee_fio,
      jsonData.employee_seria,
      jsonData.new_employee_fio,
      jsonData.position,
      jsonData.employee_date,
      jsonData.employee_viden,
      jsonData.naimenovaniya_tex,
      jsonData.inv_tex,
    ];

    const isValid = requiredFields.every(value => value);
    setIsFormValid(isValid);
    setIsPdfUpdated(false);
    setIsFileUploaded(false);
    if (isValid) setPdffile('new_output.pdf');
  }, [jsonData]);


  const fetchPdfUrl = async (filename) => {
    try {
      const token = localStorage.getItem('token'); // Tokenni olish
      const timestamp = new Date().getTime();
    
      const response = await fetch(`${BACK_API}api/sendpdf?timestamp=${timestamp}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Authorization Header
        },
        body: JSON.stringify({ fileName: filename, date: jsonData.employee_date }), // `data.data_vydachi` ni yuborish
      });
  
      if (response.status === 403) {
        // Tokenni tekshirish
        setText("Срок действия вашего токена истек");
        setSuccess(false);
        setShowSuccess(true);
  
        setTimeout(() => {
          setShowSuccess(false); // Error message ni yashirish uchun
          navigate("/"); // Login sahifasiga yo'naltirish
        }, 3000);
        return;
      }
  
      if (!response.ok) throw new Error('Failed to fetch PDF URL');
  
      const data = await response.json();
      setPdfUrl(`${data.pdfUrl}?timestamp=${timestamp}`);
    } catch (error) {
      console.error('Error fetching PDF URL:', error);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputData = {
      ...jsonData,
      invoiceNumber: '67890',
    };

    try {
      const token = localStorage.getItem('token'); // Get token from localStorage

      const response = await fetch(`${BACK_API}api/updatePdftransfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        },
        body: JSON.stringify(inputData),
      });

      // Check for token expiration (403 status)
      if (response.status === 403) {
        setText("Срок действия вашего токена истек");
        setSuccess(false);
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false); // Hide the error message after 3 seconds
          navigate("/"); // Redirect to login page
        }, 3000);
        return; // Stop further execution if token is expired
      }

      if (response.ok) {
        setPdffile('output.pdf');
        setIsPdfUpdated(true);
        setIsFormValid(false);
      } else {
        alert('Error: ' + await response.text());
      }
    } catch (error) {
      console.error('Error during submission:', error);
      alert('An unexpected error occurred.');
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token'); // Get token from localStorage

      const response = await fetch(`${BACK_API}api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
        body: formData,
      });

      // Check for token expiration (403 status)
      if (response.status === 403) {
        setText("Срок действия вашего токена истек");
        setSuccess(false);
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false); // Hide the error message after 3 seconds
          navigate("/"); // Redirect to login page
        }, 3000);
        return; // Stop further execution if token is expired
      }

      if (response.ok) {
        setPdffile('output.pdf');
        setIsFileUploaded(true);
        setInputsDisabled(true);
        fetchPdfUrl('output.pdf'); // Call to fetch the PDF URL after upload
      } else {
        alert('Error: ' + await response.text());
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      alert(error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
  };

  const handleClear = () => {
    setJsonData({
      employee_podrazdelenie: '',
      order_name: '',
      employee_fio: '',
      employee_seria: '',
      employee_date: '',
      employee_viden: '',
      naimenovaniya_tex: '',
      inv_tex: '',
      new_employee_fio: '',
      position: '',
    });
    setPdfUrl('');
    setIsFileUploaded(false);
    setIsPdfUpdated(false);
    setPdffile('new_output.pdf');
  };

  // Function to trigger file input
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Function to handle completion and save data to backend
  const handleComplete = async () => {
    const inputData = {
      data: data, // 'data' ma'lumoti
      data_vydachi: jsonData.employee_date, // 'data_vydachi' sifatida employee_date ni ishlatish
      id: data.id, // 'id' - acception jadvalidan olingan id
      должность: jsonData.position, // 'должность'
      кем_выдан: jsonData.employee_viden, // 'кем_выдан'
      наименование_техники: jsonData.naimenovaniya_tex, // 'наименование_техники'
      отдел: jsonData.order_name, // 'отдел'
      подразделение: jsonData.employee_podrazdelenie, // 'подразделение'
      сотрудник: localStorage.getItem('username'), // 'сотрудник'
      файл_pdf: "output.pdf", // 'файл_pdf'
      фио: jsonData.employee_fio, // 'фио'
      мак_адрес: jsonData.macadress,
      transfers: data, // 'transfers' from data
    };        
  
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
  
      const response = await fetch(`${BACK_API}api/sendtransfered`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
        body: JSON.stringify(inputData),
      });
  
      // Check for token expiration (403 status)
      if (response.status === 403) {
        setText("Срок действия вашего токена истек");
        setSuccess(false);
        setShowSuccess(true);
  
        setTimeout(() => {
          setShowSuccess(false); // Hide the error message after 3 seconds
          navigate("/"); // Redirect to login page
        }, 3000);
        return; // Stop further execution if token is expired
      }
      
      if (response.ok) {
        const result = await response.json();
        setText("Техника успешно возвращена");
        setSuccess(true);
        setShowSuccess(true); // Show success message
  
        setTimeout(() => {
          setShowSuccess(false); // Hide the success message after 3 seconds
          onClose(); // Close the modal after success
          window.location.reload()
        }, 3000);
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.message || 'Не удалось сохранить данные.'}`);
      }
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      alert('Произошла непредвиденная ошибка при отправке данных.');
    }
  };
  
  const renderSuccessMessage = () => {
    if (showSuccess) {
      return <Referense title={text} background={success} />;
    }
  };

  return (
    show && (
      <div className="largemodal-overlay">
        <div className="largemodal-content">
          <h2>Transfers</h2>
          <div className="largemodal-body">
            <div className="largemodal-left">
              <form onSubmit={handleSubmit}>
                <div className="input-row">
                  <label>
                    Подразделение:
                    <input
                      type="text"
                      name="employee_podrazdelenie"
                      value={jsonData.employee_podrazdelenie}
                      onChange={(e) => handleInputChange(e, setJsonData)}
                      className="largemodal-input"
                      disabled={inputsDisabled}
                    />
                  </label>
                  <label>
                    Отдел:
                    <input
                      type="text"
                      name="order_name"
                      value={jsonData.order_name}
                      onChange={(e) => handleInputChange(e, setJsonData)}
                      className="largemodal-input"
                      disabled={inputsDisabled}
                    />
                  </label>
                </div>
                <div className="input-row">
                  <label>
                    ФИО сотрудника:
                    <input
                      type="text"
                      name="employee_fio"
                      value={jsonData.employee_fio}
                      onChange={(e) => handleInputChange(e, setJsonData)}
                      className="largemodal-input"
                      disabled={inputsDisabled}
                    />
                  </label>
                  <label>
                    Серийный номер:
                    <input
                      type="text"
                      name="employee_seria"
                      value={jsonData.employee_seria}
                      onChange={(e) => handleInputChange(e, setJsonData)}
                      className="largemodal-input"
                      disabled={inputsDisabled}
                    />
                  </label>
                </div>
                <div className="input-row">
                  <label>
                    Сокращенно ФИО:
                    <input
                      type="text"
                      name="new_employee_fio"
                      value={jsonData.new_employee_fio}
                      readOnly
                      className="largemodal-input"
                      disabled={inputsDisabled}
                    />
                  </label>
                </div>
                <div className="input-row">
                  <label>
                    Должность:
                    <select
                      name="position"
                      value={jsonData.position}
                      onChange={(e) => handleInputChange(e, setJsonData)}
                      className="largemodal-input"
                      disabled={inputsDisabled}
                    >
                      <option value="">Выберите должность</option>
                      <option value="Специалист">Специалист</option>
                      <option value="Начальник отдела">Начальник отдела</option>
                    </select>
                  </label>
                </div>
                <div className="input-row">
                  <label>
                    Дата видача паспорт:
                    <input
                      type="date"
                      name="employee_date"
                      value={jsonData.employee_date}
                      onChange={(e) => handleInputChange(e, setJsonData)}
                      className="largemodal-input"
                      disabled={inputsDisabled}
                    />
                  </label>
                  <label>
                    Кем видан:
                    <input
                      type="text"
                      name="employee_viden"
                      value={jsonData.employee_viden}
                      onChange={(e) => handleInputChange(e, setJsonData)}
                      className="largemodal-input"
                      disabled={inputsDisabled}
                    />
                  </label>
                </div>
                <div className="input-row">
                  <label>
                    Наименования тех:
                    <input
                      type="text"
                      name="naimenovaniya_tex"
                      value={jsonData.naimenovaniya_tex}
                      onChange={(e) => handleInputChange(e, setJsonData)}
                      className="largemodal-input"
                      disabled={inputsDisabled}
                    />
                  </label>
                  <label>
                    Инв. тех:
                    <input
                      type="text"
                      name="inv_tex"
                      value={jsonData.inv_tex}
                      onChange={(e) => handleInputChange(e, setJsonData)}
                      className="largemodal-input"
                      disabled={inputsDisabled}
                    />
                  </label>
                </div>

                <div className="button-group">
                  <button
                    type="submit"
                    className="largemodal-submit-btn"
                    disabled={!isFormValid}
                  >
                    Проверять
                  </button>
                  <button
                    type="button"
                    className="largemodal-submit-btn"
                    onClick={triggerFileInput}
                    disabled={!isPdfUpdated}
                  >
                    Загрузить
                  </button>
                  <button
                    type="button"
                    className="largemodal-submit-btn"
                    onClick={handleComplete}
                    disabled={!isFileUploaded}
                  >
                    возвращать
                  </button>
                  <button
                    type="button"
                    className="largemodal-submit-btn"
                    onClick={handleClear} // Clear button action
                  >
                    очистить
                  </button>
                  <button
                    type="button"
                    className="largemodal-submit-btn"
                    onClick={onClose}
                  >
                    закрыть
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </div>
              </form>
            </div>
            <div className="largemodal-right">
              {pdfUrl && (
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="100%"
                  title="PDF Document"
                />
              )}
            </div>
          </div>
        </div>
        {renderSuccessMessage()}
      </div>
    )
  );
};

export default SendModal;
