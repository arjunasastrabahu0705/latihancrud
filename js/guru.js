// Ganti dengan URL Web App Anda yang telah di-deploy
const API_URL = 'https://script.google.com/macros/s/AKfycbxPySGum3GjhuIp2-nanzsDq2FRrXll2f_ewsMAI2WjrUtxIgsX8L5_661_XovNXCPxjw/exec'; // Contoh URL

document.addEventListener('DOMContentLoaded', loadData);
    
let isEditMode = false;
let currentGuruId = '';

const addEditModal = document.getElementById('add-edit-modal');
const addBtn = document.getElementById('add-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const guruForm = document.getElementById('guru-form');

addBtn.addEventListener('click', openAddModal);
closeModalBtn.addEventListener('click', closeModal);
guruForm.addEventListener('submit', handleFormSubmit);

async function loadData() {
  const response = await fetch(`${API_URL}?action=getGuru`);
  const result = await response.json();
  if (result.guruList) {
    displayData(result.guruList);
  }
}

function displayData(data) {
  const tbody = document.querySelector('#data-table tbody');
  tbody.innerHTML = '';
  data.forEach(guru => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${guru.id_guru}</td>
      <td>${guru.nip}</td>
      <td>${guru.nama_guru}</td>
      <td>${guru.jk}</td>
      <td>${guru.hp}</td>
      <td>${guru.timestamp}</td>
      <td>
        <img src="https://img.icons8.com/material-rounded/24/000000/edit--v1.png" alt="Edit" onclick="openEditModal('${guru.id_guru}', '${guru.nip}', '${guru.nama_guru}', '${guru.jk}', '${guru.hp}')">
        <img src="https://img.icons8.com/material-rounded/24/000000/delete.png" alt="Hapus" onclick="deleteGuru('${guru.id_guru}')">
      </td>
    `;
  });
}

function openAddModal() {
  isEditMode = false;
  document.getElementById('modal-title').textContent = 'Tambah Guru';
  document.getElementById('guru-form').reset();
  document.getElementById('id_guru').value = '';
  document.getElementById('id_guru').disabled = true;
  addEditModal.style.display = 'block';
}

function openEditModal(id_guru, nip, nama_guru, jk, hp) {
  isEditMode = true;
  currentGuruId = id_guru;
  document.getElementById('modal-title').textContent = 'Edit Guru';
  document.getElementById('id_guru').value = id_guru;
  document.getElementById('nip').value = nip;
  document.getElementById('nama_guru').value = nama_guru;
  document.getElementById('jk').value = jk;
  document.getElementById('hp').value = hp;
  document.getElementById('id_guru').disabled = true;
  addEditModal.style.display = 'block';
}

function closeModal() {
  addEditModal.style.display = 'none';
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const data = {
    id_guru: document.getElementById('id_guru').value,
    nip: document.getElementById('nip').value,
    nama_guru: document.getElementById('nama_guru').value,
    jk: document.getElementById('jk').value,
    hp: document.getElementById('hp').value,
  };

  if (isEditMode) {
    await sendApiRequest('editGuru', { guru: data });
  } else {
    await sendApiRequest('addGuru', { guru: data });
  }
}

async function sendApiRequest(action, payload) {
  const response = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action, ...payload }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  if (result.status === 'success') {
    alert(result.message);
    closeModal();
    loadData();
  } else {
    alert("Gagal: " + result.message);
  }
}

async function deleteGuru(id_guru) {
  if (confirm(`Apakah Anda yakin ingin menghapus guru dengan ID ${id_guru}?`)) {
    await sendApiRequest('deleteGuru', { id_guru });
  }
}
