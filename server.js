const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const HUBSPOT_BASE_URL = 'https://api.hubapi.com/crm/v3/objects/contacts';

// Helper: attach Bearer token
function getAuthHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

// GET all contacts
app.get('/contacts', async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const response = await axios.get(HUBSPOT_BASE_URL, {
      headers: getAuthHeader(token)
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// GET contact by ID
app.get('/contacts/:id', async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const { id } = req.params;
    const response = await axios.get(`${HUBSPOT_BASE_URL}/${id}?properties=firstname,lastname,id,email,hs_lead_status`, {
      headers: getAuthHeader(token)
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// PATCH contact by ID
app.patch('/contacts/:id', async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const { id } = req.params;
    const response = await axios.patch(`${HUBSPOT_BASE_URL}/${id}`, {
      properties: req.body.properties
    }, {
      headers: {
        ...getAuthHeader(token),
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// PATCH contact by Email (with idProperty=email)
app.patch('/contacts/email/:email', async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const { email } = req.params;
    const response = await axios.patch(
      `${HUBSPOT_BASE_URL}/${email}?idProperty=email`,
      {
        properties: req.body.properties
      },
      {
        headers: {
          ...getAuthHeader(token),
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// DELETE contact by ID
app.delete('/contacts/:id', async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const { id } = req.params;
    const response = await axios.delete(`${HUBSPOT_BASE_URL}/${id}`, {
      headers: getAuthHeader(token)
    });
    res.status(204).send(); // No content
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});


                //     ⚡⚡⚡⚡⚡⚡⚡⚡DEALS ENDPOINTS FROM HERE ->>>>>>>>>>>>>>>>>>>













//Get all deals
app.get('/deals', async (req, res) => {
  const authToken = req.headers.authorization;

  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/deal', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Get a specific deal by ID
app.get('/deals/:id', async (req, res) => {
  const authToken = req.headers.authorization;
  const dealId = req.params.id;

  try {
    const response = await fetch(`https://api.hubapi.com/crm/v3/objects/deal/${dealId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});



// 🔍 Finds deals with exact name match
app.post('/deals/search-by-name-exact', async (req, res) => {
  const authToken = req.headers.authorization;
  const { name } = req.body;

  const body = {
    filterGroups: [{
      filters: [{
        propertyName: 'dealname',
        operator: 'EQ',
        value: name
      }]
    }],
    properties: ['dealname', 'amount'],
    limit: 5,
    sorts: ['-createdate']
  };

  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/deals/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// 🔹 Create a New Deal
app.post('/deals', async (req, res) => {
  const authToken = req.headers.authorization;
  const body = req.body;

  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});


// 🔻 Delete a Deal by ID
app.delete('/deals/:id', async (req, res) => {
  const authToken = req.headers.authorization;
  const dealId = req.params.id;

  try {
    const response = await fetch(`https://api.hubapi.com/crm/v3/objects/deals/${dealId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    if (response.status === 204) {
      res.status(204).send(); // No content
    } else {
      const data = await response.json();
      res.status(response.status).json(data);
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});



// ✅ Update a deal by ID – including deal stage
app.patch('/deals/:id', async (req, res) => {
  const authToken = req.headers.authorization;
  const dealId = req.params.id;
  const body = req.body;

  try {
    const response = await fetch(`https://api.hubapi.com/crm/v3/objects/deals/${dealId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});



// 🔍 Finds deals containing part of the name
app.post('/deals/search-by-name-contains', async (req, res) => {
  const authToken = req.headers.authorization;
  const { namePart } = req.body;

  const body = {
    filterGroups: [{
      filters: [{
        propertyName: 'dealname',
        operator: 'CONTAINS_TOKEN',
        value: namePart
      }]
    }],
    properties: ['dealname', 'amount'],
    limit: 5,
    sorts: ['-createdate']
  };

  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/deals/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});



// Search deals with filters, sorts, and pagination
app.post('/deals/search', async (req, res) => {
  const authToken = req.headers.authorization;
  const body = req.body;

  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/deals/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});






//             ---------------------COMPANIES ENDPOINTS FROM HERE ->>>>>>>>>>>>>>>>>>>





// GET all companies (limit 10, archived = false)
app.get('/companies', async (req, res) => {
  const authToken = req.headers.authorization;

  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/companies?limit=10&archived=false', {
      method: 'GET',
      headers: {
        Authorization: authToken
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});



// GET - Company by ID
app.get('/companies/:id', async (req, res) => {
  const authToken = req.headers.authorization;
  const { id } = req.params;

  try {
    const response = await fetch(`https://api.hubapi.com/crm/v3/objects/companies/${id}`, {
      method: 'GET',
      headers: {
        Authorization: authToken
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});






// POST - Create a new company
app.post('/companies', async (req, res) => {
  const authToken = req.headers.authorization;
  const body = req.body;

  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});




// PATCH - Update Company by ID
app.patch('/companies/:id', async (req, res) => {
  const authToken = req.headers.authorization;
  const { id } = req.params;
  const body = req.body;

  try {
    const response = await fetch(`https://api.hubapi.com/crm/v3/objects/companies/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});


app.delete('/companies/:id', async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const { id } = req.params;

    const response = await axios.delete(`https://api.hubapi.com/crm/v3/objects/companies/${id}`, {
      headers: {
        Authorization: token
      }
    });

    if (response.status === 204) {
      res.status(204).send(); // No content
    } else {
      res.status(response.status).json(response.data);
    }
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});




// ---------------------------------Search companies by name ()--------------------

app.post('/companies/search', async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const body = req.body;

    const response = await axios.post(
      'https://api.hubapi.com/crm/v3/objects/companies/search',
      body,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});







//--------------------------------------TICKETTS ENDPOINTS FROM HERE ->>>>>>>>>>>>>>>>>>>







const HUBSPOT_TICKET_URL = 'https://api.hubapi.com/crm/v3/objects/tickets';

// GET all tickets
app.get('/tickets', async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const response = await axios.get('https://api.hubapi.com/crm/v3/objects/tickets', {
      params: {
        limit: 10,
        archived: false
      },
      headers: {
        Authorization: token,
        Accept: 'application/json'
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});



// GET ticket by ID
app.get('/tickets/:id', async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const { id } = req.params;
    const response = await axios.get(`https://api.hubapi.com/crm/v3/objects/tickets/${id}`, {
      headers: {
        Authorization: token,
        Accept: 'application/json'
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});


// create ticket by ID
app.post('/tickets', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const body = req.body;

    const response = await axios.post(
      'https://api.hubapi.com/crm/v3/objects/tickets',
      body,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});


//update ticket by ID
app.patch('/tickets/:id', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { id } = req.params;
    const body = req.body;

    const response = await axios.patch(
      `https://api.hubapi.com/crm/v3/objects/tickets/${id}`,
      body,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});


//delete ticket by ID
app.delete('/tickets/:id', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { id } = req.params;

    const response = await axios.delete(
      `https://api.hubapi.com/crm/v3/objects/tickets/${id}`,
      {
        headers: {
          Authorization: token
        }
      }
    );

    res.status(response.status).send();
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});



// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ HubSpot Agent API running on http://localhost:${PORT}`);
});
