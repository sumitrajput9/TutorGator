// src/apiService.js
import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Login function
export const login = async (email, password) => {
  try {
    const response = await api.post(`${apiBaseUrl}/web_login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};


export const getEvents = async (data) => {
  try {
    const response = await api.post(`${apiBaseUrl}/get_events`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const saveEvent = async (eventData) => {
  try {
    const formData = new FormData();
    // formData.append('user_type', 'teacher');
    Object.entries(eventData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const response = await axios.post(
      `${apiBaseUrl}/save_update_events`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving event:', error);
    throw error;
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const formData = new FormData();
    Object.entries(eventData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const response = await axios.post(
      `${apiBaseUrl}/save_update_events`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};


export const deleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(
      `${apiBaseUrl}/delete_events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};


export const getTemplateById = async (templateId) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/get_message_templates_by_event/${templateId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching template:', error);
    throw error;
  }
};

export const addTemplate = async (templateData) => {
  try {
    const formData = new FormData();
    Object.entries(templateData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const response = await axios.post(`${apiBaseUrl}/save_update_message_template`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding template:', error);
    throw error;
  }
};

export const updateTemplate = async (templateId, templateData) => {
  try {
    console.log(templateData, "templateData");

    const formData = new FormData();
    formData.append('id', templateId);
    Object.entries(templateData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const response = await axios.post(
      `${apiBaseUrl}/save_update_message_template`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating template:', error);
    throw error;
  }
};



export const getTeacher = async () => {
  try {
    const response = await axios.post(`${apiBaseUrl}/get_users`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;

  }
}

export const getUserId = async (teacherId) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/get_teacher_info`, { teacher_id: teacherId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;

  }
}


export const pushNotification = async (notificationData) => {
  try {
    const formData = new FormData();
    Object.entries(notificationData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const response = await axios.post(`${apiBaseUrl}/send_push_notification`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const pushNotificationAll = async (notificationData) => {
  try {
    const formData = new FormData();
    Object.entries(notificationData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const response = await axios.post(`${apiBaseUrl}/send_notification_to_all`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const deleteTemplate = async (templateId) => {
  try {
    const response = await axios.delete(`${apiBaseUrl}/delete_message_template/${templateId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting template:', error);
    throw error;
  }
};

// payout apis
export const getTeacherPendingPayout = async () => {
  try {
    const response = await axios.post(`${apiBaseUrl}/get_teachers_with_pending_payments`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getPaymentData = async (requestData) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/tutors_payment`, requestData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


export const getClientById = async (clientId) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/get_client_by_id/${clientId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getUserLoginDetails = async (userId) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/getUserDetails/${userId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getInvoiceData = async (searchQuery) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/get_all_booking/?search=${searchQuery}`, {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice data:', error);
    throw error;
  }
};

export const getSessionInvoiceData = async (searchQuery) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/booking/${searchQuery}/sessions`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice data:', error);
    throw error;
  }
};

export const getInvoice = async (bookingId) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/get_invoice/${bookingId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading invoice:', error);
    throw error;
  }
};

export const getSessionInvoice = async (id) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/get_session_invoice/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading invoice:', error);
    throw error;
  }
};

export const getSessionReport = async (data) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/get_session_report`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading session report:', error);
    throw error;
  }
}




export default api;
