import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { STORE_CONFIG } from '../config/store.js';
import { getSettings, getSocialLinks } from '../services/api.js';
import { normalizeBuy2Offer, normalizeLoyaltySettings } from '../utils/promotions.js';
import { buildWhatsAppLink, buildWhatsAppUrl } from '../utils/whatsappLink.js';

const StoreDataContext = createContext(null);

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeSettings(settings = {}) {
  const source = asObject(settings);
  const whatsappNumber = source.whatsapp_number || source.whatsappNumber || STORE_CONFIG.whatsappNumber;

  return {
    name: source.store_name || source.name || STORE_CONFIG.name,
    whatsappNumber,
    currency: source.currency || STORE_CONFIG.currency,
    deliveryFee: Number(source.delivery_fee ?? source.deliveryFee ?? STORE_CONFIG.deliveryFee),
    defaultLanguage: source.default_language || source.defaultLanguage || STORE_CONFIG.defaultLanguage,
    paymentMethod: source.payment_method || 'cash_on_delivery',
    country: source.country || 'Morocco',
    facebookLink: source.facebook || STORE_CONFIG.facebookLink,
    instagramLink: source.instagram || STORE_CONFIG.instagramLink,
    tiktokLink: source.tiktok || STORE_CONFIG.tiktokLink,
    youtubeLink: source.youtube || STORE_CONFIG.youtubeLink,
    whatsappLink: buildWhatsAppLink(whatsappNumber, STORE_CONFIG.whatsappNumber),
    buy2Offer: normalizeBuy2Offer(source),
    loyalty: normalizeLoyaltySettings(source),
  };
}

function normalizeSocialLinks(links = [], settings = fallbackSettings) {
  const safeSettings = asObject(settings);
  const fromApi = asArray(links).reduce((currentLinks, link) => {
    if (!link?.platform || !link?.url) return currentLinks;

    return {
      ...currentLinks,
      [link.platform]: link.url,
    };
  }, {});

  return {
    whatsapp: safeSettings.whatsappLink || fromApi.whatsapp || fallbackSettings.whatsappLink,
    facebook: fromApi.facebook || safeSettings.facebookLink || fallbackSettings.facebookLink,
    instagram: fromApi.instagram || safeSettings.instagramLink || fallbackSettings.instagramLink,
    tiktok: fromApi.tiktok || safeSettings.tiktokLink || fallbackSettings.tiktokLink,
    youtube: fromApi.youtube || safeSettings.youtubeLink || fallbackSettings.youtubeLink,
  };
}

const fallbackSettings = normalizeSettings(STORE_CONFIG);
const fallbackSocialLinks = normalizeSocialLinks([], fallbackSettings);

export function StoreDataProvider({ children }) {
  const isMountedRef = useRef(false);
  const [settings, setSettings] = useState(fallbackSettings);
  const [socialLinks, setSocialLinks] = useState(fallbackSocialLinks);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshStoreData = useCallback(async () => {
    setIsLoading(true);

    const [settingsResult, socialLinksResult] = await Promise.allSettled([
      getSettings(),
      getSocialLinks(),
    ]);

    if (!isMountedRef.current) return;

    const nextSettings =
      settingsResult.status === 'fulfilled'
        ? normalizeSettings(settingsResult.value)
        : fallbackSettings;
    const nextSocialLinks =
      socialLinksResult.status === 'fulfilled'
        ? normalizeSocialLinks(socialLinksResult.value, nextSettings)
        : normalizeSocialLinks([], nextSettings);

    setSettings(nextSettings);
    setSocialLinks(nextSocialLinks);
    setError(
      settingsResult.status === 'rejected' || socialLinksResult.status === 'rejected'
        ? 'Store settings are using local fallback values.'
        : ''
    );
    setIsLoading(false);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    refreshStoreData();
    return () => {
      isMountedRef.current = false;
    };
  }, [refreshStoreData]);

  const value = useMemo(
    () => ({
      settings: settings || fallbackSettings,
      socialLinks: socialLinks || fallbackSocialLinks,
      isLoading,
      error,
      refreshStoreData,
      getWhatsAppUrl: (message = '') => {
        const currentSettings = settings || fallbackSettings;

        return buildWhatsAppUrl(currentSettings.whatsappNumber, message, STORE_CONFIG.whatsappNumber);
      },
    }),
    [error, isLoading, refreshStoreData, settings, socialLinks]
  );

  return <StoreDataContext.Provider value={value}>{children}</StoreDataContext.Provider>;
}

export function useStoreData() {
  const context = useContext(StoreDataContext);

  if (!context) {
    throw new Error('useStoreData must be used inside StoreDataProvider');
  }

  return context;
}