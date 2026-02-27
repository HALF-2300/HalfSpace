'use client'

import { useState, useEffect } from 'react'
import styles from './Collections.module.css'
import {
  getCollections,
  createCollection,
  addToCollection,
  getCollectionsContaining,
  removeFromCollection,
  Collection,
  COLLECTION_ICONS
} from '@/lib/collections'

interface AddToCollectionProps {
  pageId: string
  pageName: string
  onClose: () => void
}

export default function AddToCollection({ pageId, pageName, onClose }: AddToCollectionProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [inCollections, setInCollections] = useState<string[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('🚀')

  useEffect(() => {
    setCollections(getCollections())
    setInCollections(getCollectionsContaining(pageId).map(c => c.id))
  }, [pageId])

  const handleToggle = (collectionId: string) => {
    if (inCollections.includes(collectionId)) {
      removeFromCollection(collectionId, pageId)
      setInCollections(prev => prev.filter(id => id !== collectionId))
    } else {
      addToCollection(collectionId, pageId)
      setInCollections(prev => [...prev, collectionId])
    }
  }

  const handleCreate = () => {
    if (!newName.trim()) return
    
    const collection = createCollection(newName.trim(), '', newIcon)
    addToCollection(collection.id, pageId)
    
    setCollections(getCollections())
    setInCollections(prev => [...prev, collection.id])
    setShowCreate(false)
    setNewName('')
    setNewIcon('🚀')
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.addModal} onClick={e => e.stopPropagation()}>
        <div className={styles.addHeader}>
          <h2>Add to Collection</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <p className={styles.addPageName}>
          Adding: <strong>{pageName}</strong>
        </p>

        {showCreate ? (
          <div className={styles.quickCreate}>
            <div className={styles.quickCreateRow}>
              <select 
                value={newIcon} 
                onChange={(e) => setNewIcon(e.target.value)}
                className={styles.iconSelect}
              >
                {COLLECTION_ICONS.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Collection name..."
                className={styles.quickInput}
                autoFocus
              />
            </div>
            <div className={styles.quickActions}>
              <button onClick={() => setShowCreate(false)} className={styles.quickCancel}>
                Cancel
              </button>
              <button onClick={handleCreate} className={styles.quickSave} disabled={!newName.trim()}>
                Create & Add
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.collectionList}>
              {collections.length === 0 ? (
                <p className={styles.noCollections}>No collections yet</p>
              ) : (
                collections.map(collection => (
                  <button
                    key={collection.id}
                    className={`${styles.collectionOption} ${inCollections.includes(collection.id) ? styles.selected : ''}`}
                    onClick={() => handleToggle(collection.id)}
                  >
                    <span className={styles.optionIcon}>{collection.icon}</span>
                    <span className={styles.optionName}>{collection.name}</span>
                    <span className={styles.optionCheck}>
                      {inCollections.includes(collection.id) ? '✓' : '+'}
                    </span>
                  </button>
                ))
              )}
            </div>

            <button 
              className={styles.newCollectionButton}
              onClick={() => setShowCreate(true)}
            >
              + Create New Collection
            </button>
          </>
        )}
      </div>
    </div>
  )
}
