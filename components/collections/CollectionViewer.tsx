'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './Collections.module.css'
import {
  getCollectionById,
  getCollectionItems,
  updateCollection,
  removeFromCollection,
  generateShareUrl,
  togglePublic,
  Collection,
  COLLECTION_ICONS
} from '@/lib/collections'
import { JumpDestination } from '@/lib/jumpEngine'

interface CollectionViewerProps {
  collectionId: string
}

export default function CollectionViewer({ collectionId }: CollectionViewerProps) {
  const router = useRouter()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [items, setItems] = useState<JumpDestination[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editIcon, setEditIcon] = useState('')
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const col = getCollectionById(collectionId)
    if (col) {
      setCollection(col)
      setItems(getCollectionItems(collectionId))
      setEditName(col.name)
      setEditDescription(col.description)
      setEditIcon(col.icon)
    }
  }, [collectionId])

  const handleSaveEdit = () => {
    if (!collection || !editName.trim()) return
    
    updateCollection(collection.id, {
      name: editName.trim(),
      description: editDescription.trim(),
      icon: editIcon
    })
    
    setCollection(getCollectionById(collectionId) || null)
    setIsEditing(false)
  }

  const handleRemoveItem = (itemId: string) => {
    if (!collection) return
    
    removeFromCollection(collection.id, itemId)
    setItems(getCollectionItems(collection.id))
  }

  const handleShare = async () => {
    if (!collection) return
    
    const url = generateShareUrl(collection)
    
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  const handleTogglePublic = () => {
    if (!collection) return
    togglePublic(collection.id)
    setCollection(getCollectionById(collectionId) || null)
  }

  if (!collection) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>❓</span>
          <h2>Collection not found</h2>
          <Link href="/collections" className={styles.backLink}>
            ← Back to Collections
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.viewerHeader}>
        <Link href="/collections" className={styles.backLink}>
          ← Collections
        </Link>
        
        <div className={styles.viewerActions}>
          <button 
            className={styles.actionButton}
            onClick={() => setShowShare(true)}
          >
            📤 Share
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => setIsEditing(true)}
          >
            ✏️ Edit
          </button>
        </div>
      </div>

      {/* Collection Info */}
      <div className={styles.viewerInfo}>
        <span className={styles.viewerIcon}>{collection.icon}</span>
        <div className={styles.viewerMeta}>
          <h1 className={styles.viewerTitle}>{collection.name}</h1>
          {collection.description && (
            <p className={styles.viewerDescription}>{collection.description}</p>
          )}
          <div className={styles.viewerStats}>
            <span>{items.length} items</span>
            <span>•</span>
            <span>Created {new Date(collection.createdAt).toLocaleDateString()}</span>
            {collection.isPublic && <span className={styles.publicBadge}>Public</span>}
          </div>
        </div>
      </div>

      {/* Start Journey Button */}
      {items.length > 0 && (
        <button 
          className={styles.startJourneyButton}
          onClick={() => router.push(items[0].url)}
        >
          🚀 Start Journey
        </button>
      )}

      {/* Items List */}
      <div className={styles.itemsList}>
        {items.length === 0 ? (
          <div className={styles.emptyItems}>
            <p>This collection is empty.</p>
            <p>Visit any page and press <kbd>S</kbd> to add it here.</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div key={item.id} className={styles.itemCard}>
              <span className={styles.itemNumber}>{index + 1}</span>
              <span className={styles.itemIcon}>{item.icon}</span>
              <div className={styles.itemInfo}>
                <Link href={item.url} className={styles.itemTitle}>
                  {item.title}
                </Link>
                <span className={styles.itemCategory}>{item.category}</span>
              </div>
              <button 
                className={styles.removeButton}
                onClick={() => handleRemoveItem(item.id)}
                title="Remove from collection"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className={styles.modalOverlay} onClick={() => setIsEditing(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Edit Collection</h2>
            
            <div className={styles.formGroup}>
              <label>Icon</label>
              <div className={styles.iconGrid}>
                {COLLECTION_ICONS.map(icon => (
                  <button
                    key={icon}
                    className={`${styles.iconButton} ${editIcon === icon ? styles.iconSelected : ''}`}
                    onClick={() => setEditIcon(icon)}
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
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className={styles.textarea}
                rows={3}
              />
            </div>

            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.saveButton}
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShare && (
        <div className={styles.modalOverlay} onClick={() => setShowShare(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Share Collection</h2>
            
            <div className={styles.shareInfo}>
              <p>Share this collection with others:</p>
              
              <div className={styles.shareCode}>
                <span>{collection.shareCode}</span>
              </div>

              <button 
                className={styles.copyButton}
                onClick={handleShare}
              >
                {copied ? '✓ Copied!' : '📋 Copy Share Link'}
              </button>

              <div className={styles.publicToggle}>
                <label>
                  <input
                    type="checkbox"
                    checked={collection.isPublic}
                    onChange={handleTogglePublic}
                  />
                  Make collection public
                </label>
              </div>
            </div>

            <button 
              className={styles.cancelButton}
              onClick={() => setShowShare(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
