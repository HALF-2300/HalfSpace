'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './Collections.module.css'
import {
  getCollections,
  createCollection,
  deleteCollection,
  getCollectionItems,
  Collection,
  COLLECTION_ICONS
} from '@/lib/collections'
import { JumpDestination } from '@/lib/jumpEngine'

export default function CollectionsHub() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newIcon, setNewIcon] = useState('🚀')

  useEffect(() => {
    setCollections(getCollections())
  }, [])

  const handleCreate = () => {
    if (!newName.trim()) return
    
    createCollection(newName.trim(), newDescription.trim(), newIcon)
    setCollections(getCollections())
    setShowCreate(false)
    setNewName('')
    setNewDescription('')
    setNewIcon('🚀')
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this collection?')) {
      deleteCollection(id)
      setCollections(getCollections())
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>📚 Collections</h1>
          <p className={styles.subtitle}>Curate your cosmic journeys</p>
        </div>
        <button 
          className={styles.createButton}
          onClick={() => setShowCreate(true)}
        >
          + New Collection
        </button>
      </div>

      {collections.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📚</span>
          <h2>No collections yet</h2>
          <p>Create your first collection to save and organize your favorite discoveries.</p>
          <button 
            className={styles.createButtonLarge}
            onClick={() => setShowCreate(true)}
          >
            Create Collection
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {collections.map(collection => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onDelete={() => handleDelete(collection.id)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className={styles.modalOverlay} onClick={() => setShowCreate(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Create Collection</h2>
            
            <div className={styles.formGroup}>
              <label>Icon</label>
              <div className={styles.iconGrid}>
                {COLLECTION_ICONS.map(icon => (
                  <button
                    key={icon}
                    className={`${styles.iconButton} ${newIcon === icon ? styles.iconSelected : ''}`}
                    onClick={() => setNewIcon(icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="My Black Hole Run"
                className={styles.input}
                autoFocus
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description (optional)</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="A journey through the darkest corners of space..."
                className={styles.textarea}
                rows={3}
              />
            </div>

            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.saveButton}
                onClick={handleCreate}
                disabled={!newName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CollectionCard({ 
  collection, 
  onDelete 
}: { 
  collection: Collection
  onDelete: () => void 
}) {
  const [items, setItems] = useState<JumpDestination[]>([])

  useEffect(() => {
    setItems(getCollectionItems(collection.id))
  }, [collection.id])

  return (
    <Link href={`/collections/${collection.id}`} className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon}>{collection.icon}</span>
        <button 
          className={styles.deleteButton}
          onClick={(e) => {
            e.preventDefault()
            onDelete()
          }}
        >
          🗑️
        </button>
      </div>
      
      <h3 className={styles.cardTitle}>{collection.name}</h3>
      {collection.description && (
        <p className={styles.cardDescription}>{collection.description}</p>
      )}
      
      <div className={styles.cardMeta}>
        <span className={styles.cardCount}>{collection.items.length} items</span>
        <span className={styles.cardDate}>
          {new Date(collection.updatedAt).toLocaleDateString()}
        </span>
      </div>

      {items.length > 0 && (
        <div className={styles.cardPreview}>
          {items.slice(0, 3).map(item => (
            <span key={item.id} className={styles.previewIcon}>{item.icon}</span>
          ))}
          {items.length > 3 && (
            <span className={styles.previewMore}>+{items.length - 3}</span>
          )}
        </div>
      )}
    </Link>
  )
}
