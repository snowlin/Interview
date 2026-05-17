export interface LoadingOptions {
  tip?: string | null;
  background?: string | null;
  size?: string;
  loading: boolean;
  absolute: boolean;
}

export interface LoadingInstance {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setTip: (tip?: string | null) => void;
  close: () => void;
}

export function createLoading(options: LoadingOptions, target: HTMLElement): LoadingInstance {
  const overlay = document.createElement("div");
  const message = document.createElement("span");

  overlay.style.position = options.absolute ? "absolute" : "fixed";
  overlay.style.inset = "0";
  overlay.style.display = options.loading ? "grid" : "none";
  overlay.style.placeItems = "center";
  overlay.style.zIndex = "999";
  overlay.style.color = "#003ca1";
  overlay.style.fontWeight = "800";
  overlay.style.background = options.background || "rgba(255, 255, 255, 0.74)";
  overlay.style.backdropFilter = "blur(4px)";
  message.textContent = options.tip || "Loading";

  overlay.appendChild(message);
  target.appendChild(overlay);

  return {
    loading: options.loading,
    setLoading(loading: boolean) {
      this.loading = loading;
      overlay.style.display = loading ? "grid" : "none";
    },
    setTip(tip?: string | null) {
      message.textContent = tip || "Loading";
    },
    close() {
      overlay.remove();
    },
  };
}
