import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../services/hostmasterApi';
import './Rooms.css';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    number: '',
    type: 'Standard',
    available: true,
    description: ''
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await getRooms();
      console.log('Quartos carregados do backend:', data);
      
      if (!data || data.length === 0) {
        console.log('Nenhum quarto encontrado no banco de dados');
      }
      
      setRooms(data || []);
    } catch (error) {
      console.error('Erro ao carregar quartos:', error);
      
      // Verifica se é erro de autenticação
      if (error.message.includes('401')) {
        alert('Sessão expirada. Por favor, faça login novamente.');
        logout();
      } else {
        console.error('Detalhes do erro:', error);
        setRooms([]);
      }
    } finally {
      setLoading(false);
    }
  };



  const handleEdit = (room) => {
    setEditingRoom({ ...room });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { id, createdAt, updatedAt, ...roomData } = editingRoom;
      console.log('Salvando quarto:', id, roomData);
      
      const updatedRoom = await updateRoom(id, roomData);
      console.log('Quarto atualizado:', updatedRoom);
      
      // Recarrega a lista do backend
      await loadRooms();
      
      setShowEditModal(false);
      setEditingRoom(null);
      alert('Quarto atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar quarto:', error);
      alert(`Erro ao salvar alterações: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja deletar o Quarto ${editingRoom.number}?`)) {
      try {
        setLoading(true);
        console.log('Deletando quarto:', editingRoom.id);
        
        await deleteRoom(editingRoom.id);
        console.log('Quarto deletado com sucesso');
        
        // Recarrega a lista do backend
        await loadRooms();
        
        setShowEditModal(false);
        setEditingRoom(null);
        alert('Quarto deletado com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar quarto:', error);
        alert(`Erro ao deletar quarto: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (field, value) => {
    setEditingRoom({ ...editingRoom, [field]: value });
  };

  const handleNewRoomChange = (field, value) => {
    setNewRoom({ ...newRoom, [field]: value });
  };

  const handleCreate = async () => {
    try {
      if (!newRoom.number || !newRoom.type) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      setLoading(true);
      console.log('Criando quarto:', newRoom);
      
      const createdRoom = await createRoom(newRoom);
      console.log('Quarto criado:', createdRoom);
      
      // Recarrega a lista do backend
      await loadRooms();
      
      // Reseta o formulário
      setNewRoom({
        number: '',
        type: 'Standard',
        available: true,
        description: ''
      });
      
      setShowCreateModal(false);
      alert('Quarto criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar quarto:', error);
      alert(`Erro ao criar quarto: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rooms-page">
      <header className="page-header">
        <div className="header-left">
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1>Gerenciar Quartos</h1>
        </div>
        <button onClick={logout} className="logout-btn">Sair</button>
      </header>

      <div className="rooms-content">
        <div className="rooms-toolbar">
          <div className="rooms-count">
            <h2>Total de Quartos: {rooms.length}</h2>
          </div>
          <button className="add-room-btn" onClick={() => setShowCreateModal(true)}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Quarto
          </button>
        </div>

        {loading ? (
          <div className="loading">Carregando quartos...</div>
        ) : (
          <div className="rooms-grid">
            {rooms.sort((a, b) => {
              // Ordena por número do quarto (numérico quando possível, alfabético caso contrário)
              const numA = parseInt(a.number);
              const numB = parseInt(b.number);
              
              if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
              }
              
              return a.number.localeCompare(b.number);
            }).map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-header">
                  <div className="room-number">Quarto {room.number}</div>
                  <div className="room-type-badge">{room.type}</div>
                </div>
                <div className="room-body">
                  <p className="room-description">{room.description}</p>
                </div>
                <div className="room-actions">
                  <button className="btn-edit" onClick={() => handleEdit(room)}>
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Adicionar Novo Quarto</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Número do Quarto *</label>
                <input
                  type="text"
                  value={newRoom.number}
                  onChange={(e) => handleNewRoomChange('number', e.target.value)}
                  placeholder="Ex: 1, 2, 170..."
                />
              </div>

              <div className="form-group">
                <label>Tipo *</label>
                <select
                  value={newRoom.type}
                  onChange={(e) => handleNewRoomChange('type', e.target.value)}
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Casa">Casa</option>
                </select>
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  rows="3"
                  value={newRoom.description}
                  onChange={(e) => handleNewRoomChange('description', e.target.value)}
                  placeholder="Descreva as características do quarto..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-actions" style={{ marginLeft: 'auto' }}>
                <button className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </button>
                <button className="btn-save" onClick={handleCreate}>
                  Criar Quarto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingRoom && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Quarto {editingRoom.number}</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Número do Quarto</label>
                <input
                  type="text"
                  value={editingRoom.number}
                  onChange={(e) => handleChange('number', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Tipo</label>
                <select
                  value={editingRoom.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Casa">Casa</option>
                </select>
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  rows="3"
                  value={editingRoom.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-delete" onClick={handleDelete}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Deletar
              </button>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </button>
                <button className="btn-save" onClick={handleSave}>
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
